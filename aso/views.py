from __future__ import annotations

import json

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import AppListing, AppMetric


def _serialize_listing(listing: AppListing) -> dict[str, object]:
    return {
        'id': listing.id,
        'name': listing.name,
        'store': listing.store,
        'bundle_id': listing.bundle_id,
        'description': listing.description,
        'rating': str(listing.rating),
        'downloads': listing.downloads,
        'icon_url': listing.icon_url,
        'last_updated': listing.last_updated.isoformat(),
        'metrics': [
            {'field': metric.field, 'value': metric.value, 'recorded_at': metric.recorded_at.isoformat()}
            for metric in listing.metrics.all()[:5]
        ],
    }


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def listing_list(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        listings = AppListing.objects.order_by('-last_updated')
        return JsonResponse({'listings': [_serialize_listing(listing) for listing in listings]})

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)

    required = {'name', 'bundle_id', 'store'}
    if not required.issubset(payload):
        return JsonResponse({'error': 'name, bundle_id, and store are required.'}, status=400)

    listing = AppListing.objects.create(
        owner=request.user,
        name=payload['name'],
        store=payload['store'],
        bundle_id=payload['bundle_id'],
        description=payload.get('description', ''),
        rating=payload.get('rating', 0),
        downloads=payload.get('downloads', 0),
        icon_url=payload.get('icon_url', ''),
    )

    metric_payload = payload.get('metrics', [])
    for metric in metric_payload:
        AppMetric.objects.create(
            listing=listing,
            field=metric.get('field', 'unknown'),
            value=metric.get('value', ''),
        )

    return JsonResponse(_serialize_listing(listing), status=201)


@login_required
def aso_dashboard(request: HttpRequest):
    return render(request, 'aso/dashboard.html')
