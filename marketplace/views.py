from __future__ import annotations

import json

from django.contrib.auth.decorators import login_required
from django.db.models import Count, Sum
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import Interaction, ProductService, Sale


def serialize_product(product: ProductService) -> dict[str, object]:
    sales = product.sales.aggregate(
        revenue=Sum('total_price'),
        count=Count('id'),
    )
    return {
        'id': product.id,
        'name': product.name,
        'kind': product.kind,
        'description': product.description,
        'price': str(product.price),
        'is_active': product.is_active,
        'owner': product.owner.username,
        'updated_at': product.updated_at.isoformat(),
        'sales_count': sales['count'] or 0,
        'revenue': str(sales['revenue'] or 0),
    }


def serialize_sale(sale: Sale) -> dict[str, object]:
    return {
        'id': sale.id,
        'product_id': sale.product_id,
        'quantity': sale.quantity,
        'total_price': str(sale.total_price),
        'note': sale.note,
        'recorded_at': sale.recorded_at.isoformat(),
    }


def serialize_interaction(interaction: Interaction) -> dict[str, object]:
    return {
        'id': interaction.id,
        'product_id': interaction.product_id,
        'channel': interaction.channel,
        'note': interaction.note,
        'created_at': interaction.created_at.isoformat(),
    }


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def product_list(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        products = ProductService.objects.order_by('-updated_at')
        return JsonResponse({'products': [serialize_product(prod) for prod in products]})

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)

    required = {'name', 'price'}
    if not required.issubset(payload):
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    product = ProductService.objects.create(
        owner=request.user,
        name=payload['name'],
        description=payload.get('description', ''),
        kind=payload.get('kind', 'product'),
        price=payload['price'],
    )
    return JsonResponse(serialize_product(product), status=201)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def sales_for_product(request: HttpRequest, product_id: int) -> JsonResponse:
    product = get_object_or_404(ProductService, pk=product_id)

    if request.method == 'GET':
        sales = product.sales.order_by('-recorded_at')[:20]
        return JsonResponse({'sales': [serialize_sale(sale) for sale in sales]})

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)

    quantity = int(payload.get('quantity', 1))
    price = payload.get('total_price')
    if not price:
        return JsonResponse({'error': 'total_price is required'}, status=400)

    sale = Sale.objects.create(
        product=product,
        quantity=quantity,
        total_price=price,
        note=payload.get('note', ''),
    )
    return JsonResponse(serialize_sale(sale), status=201)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def interactions_for_product(request: HttpRequest, product_id: int) -> JsonResponse:
    product = get_object_or_404(ProductService, pk=product_id)

    if request.method == 'GET':
        interactions = product.interactions.order_by('-created_at')[:20]
        return JsonResponse({'interactions': [serialize_interaction(i) for i in interactions]})

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)

    channel = payload.get('channel')
    note = payload.get('note')
    if not (channel and note):
        return JsonResponse({'error': 'Channel and note are required'}, status=400)

    interaction = Interaction.objects.create(
        product=product,
        channel=channel,
        note=note,
    )
    return JsonResponse(serialize_interaction(interaction), status=201)


@login_required
def marketplace_dashboard(request: HttpRequest):
    return render(request, 'marketplace/dashboard.html')
