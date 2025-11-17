from __future__ import annotations

import json

from django.http import HttpRequest, Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import Backlink, PageMeta


def serialize_page(page: PageMeta) -> dict[str, object]:
    return page.to_dict()


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


@ensure_csrf_cookie
def dashboard(request: HttpRequest) -> HttpResponse:
    return render(request, 'seo/dashboard.html')
