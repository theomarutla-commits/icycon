from __future__ import annotations

import json

from django.http import HttpRequest, Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import Backlink, DirectoryListing, PageMeta, SiteProfile


def serialize_page(page: PageMeta) -> dict[str, object]:
    return page.to_dict()


def serialize_site(site: SiteProfile) -> dict[str, object]:
    return site.to_dict()


@require_http_methods(['GET'])
def pages_list(request: HttpRequest) -> JsonResponse:
    pages = PageMeta.objects.order_by('slug')
    return JsonResponse({'pages': [serialize_page(page) for page in pages]})


def _get_page_or_404(slug: str) -> PageMeta:
    try:
        return PageMeta.objects.get(slug=slug)
    except PageMeta.DoesNotExist as exc:
        raise Http404(f'No SEO entry found for slug "{slug}"') from exc


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def page_detail(request: HttpRequest, slug: str) -> JsonResponse:
    if request.method == 'GET':
        page = _get_page_or_404(slug)
        return JsonResponse(serialize_page(page))

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    page, created = PageMeta.objects.get_or_create(
        slug=slug,
        defaults={'title': payload.get('title', slug)},
    )
    for field in ('title', 'description', 'keywords', 'canonical_url', 'is_indexable'):
        if field in payload:
            setattr(page, field, payload[field])

    if 'site_id' in payload:
        site_id = payload['site_id']
        if site_id:
            try:
                site = SiteProfile.objects.get(pk=site_id)
            except SiteProfile.DoesNotExist as exc:
                return JsonResponse({'error': 'Unknown site id'}, status=400)
            page.site = site
        else:
            page.site = None

    page.save()
    status_code = 201 if created else 200
    return JsonResponse(serialize_page(page), status=status_code)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def page_backlinks(request: HttpRequest, slug: str) -> JsonResponse:
    page = _get_page_or_404(slug)

    if request.method == 'GET':
        backlinks = page.backlinks.order_by('-created_at')
        return JsonResponse({'backlinks': [backlink.to_dict() for backlink in backlinks]})

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    backlink = Backlink.objects.create(
        page=page,
        url=payload.get('url', ''),
        anchor_text=payload.get('anchor_text', ''),
        source=payload.get('source', ''),
        status=payload.get('status', 'active'),
        is_follow=payload.get('is_follow', True),
    )

    return JsonResponse(backlink.to_dict(), status=201)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def site_list(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        sites = SiteProfile.objects.order_by('name')
        return JsonResponse({'sites': [serialize_site(site) for site in sites]})

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    domain = payload.get('domain', '').strip()
    name = payload.get('name', '').strip()
    if not domain or not name:
        return JsonResponse({'error': 'Name and domain are required.'}, status=400)

    site, created = SiteProfile.objects.get_or_create(
        domain=domain,
        defaults={
            'name': name,
            'description': payload.get('description', '').strip(),
        },
    )
    if not created:
        updated = False
        description = payload.get('description')
        if description is not None and description != site.description:
            site.description = description
            updated = True
        if name != site.name:
            site.name = name
            updated = True
        if updated:
            site.save(update_fields=['name', 'description'])

    status_code = 201 if created else 200
    return JsonResponse(serialize_site(site), status=status_code)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def directory_list(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        dirs = DirectoryListing.objects.order_by('-updated_at')
        return JsonResponse({'directories': [
            {
                'name': directory.name,
                'url': directory.url,
                'description': directory.description,
                'contact_email': directory.contact_email,
                'is_active': directory.is_active,
                'updated_at': directory.updated_at.isoformat(),
            }
            for directory in dirs
        ]})

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)

    if not payload.get('name') or not payload.get('url'):
        return JsonResponse({'error': 'Name and URL required'}, status=400)

    directory = DirectoryListing.objects.create(
        name=payload['name'],
        url=payload['url'],
        description=payload.get('description', ''),
        contact_email=payload.get('contact_email', ''),
        is_active=payload.get('is_active', True),
    )
    return JsonResponse({
        'name': directory.name,
        'url': directory.url,
        'description': directory.description,
        'contact_email': directory.contact_email,
        'is_active': directory.is_active,
        'updated_at': directory.updated_at.isoformat(),
    }, status=201)

@ensure_csrf_cookie
def dashboard(request: HttpRequest) -> HttpResponse:
    return render(request, 'seo/dashboard.html')
