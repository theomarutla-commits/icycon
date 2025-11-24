from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q, Avg, Count
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from datetime import datetime
import uuid

from .models import Product, Review, Order, SavedProduct, Conversation, Message


def marketplace_home(request):
    """Main marketplace landing page."""
    featured_products = Product.objects.filter(
        status='published'
    ).select_related('tenant').annotate(
        avg_rating=Avg('reviews__rating')
    ).order_by('-published_at')[:8]
    
    categories = Product.CATEGORY_CHOICES
    
    context = {
        'featured_products': featured_products,
        'categories': categories,
        'total_products': Product.objects.filter(status='published').count(),
        'total_sellers': Product.objects.filter(status='published').values('tenant').distinct().count(),
    }
    return render(request, 'marketplace/home.html', context)


def product_list(request):
    """Browse all marketplace products with filtering and search."""
    products = Product.objects.filter(status='published').select_related('tenant')
    
    # Search
    query = request.GET.get('q', '').strip()
    if query:
        products = products.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(tags__contains=query)
        )
    
    # Category filter
    category = request.GET.get('category', '').strip()
    if category:
        products = products.filter(category=category)
    
    # Pricing filter
    price_range = request.GET.get('price_range', '')
    if price_range == 'free':
        products = products.filter(pricing_type='free')
    elif price_range == 'under_50':
        products = products.filter(price__lt=50)
    elif price_range == '50_200':
        products = products.filter(price__gte=50, price__lt=200)
    elif price_range == 'over_200':
        products = products.filter(price__gte=200)
    
    # Sorting
    sort = request.GET.get('sort', '-published_at')
    allowed_sorts = ['-published_at', 'title', '-rating', 'price', '-price']
    if sort in allowed_sorts:
        products = products.order_by(sort)
    
    # Annotations for ratings and review counts
    products = products.annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    )
    
    context = {
        'products': products,
        'query': query,
        'category': category,
        'price_range': price_range,
        'sort': sort,
        'categories': Product.CATEGORY_CHOICES,
    }
    return render(request, 'marketplace/product_list.html', context)


def product_detail(request, product_id):
    """View product details and reviews."""
    product = get_object_or_404(
        Product.objects.select_related('tenant', 'created_by').annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ),
        id=product_id,
        status='published'
    )
    
    reviews = product.reviews.select_related('reviewer', 'tenant').order_by('-created_at')
    
    # Check if user has saved this product
    is_saved = False
    if request.user.is_authenticated:
        is_saved = SavedProduct.objects.filter(
            user=request.user,
            product=product
        ).exists()
    
    context = {
        'product': product,
        'reviews': reviews,
        'is_saved': is_saved,
        'rating_distribution': {
            5: reviews.filter(rating=5).count(),
            4: reviews.filter(rating=4).count(),
            3: reviews.filter(rating=3).count(),
            2: reviews.filter(rating=2).count(),
            1: reviews.filter(rating=1).count(),
        }
    }
    return render(request, 'marketplace/product_detail.html', context)


@login_required
def product_create(request):
    """Create a new product listing."""
    if request.method == 'POST':
        # Get the user's primary tenant
        tenant = request.user.tenantuser_set.first().tenant
        
        product = Product.objects.create(
            tenant=tenant,
            created_by=request.user,
            title=request.POST.get('title'),
            description=request.POST.get('description'),
            category=request.POST.get('category'),
            pricing_type=request.POST.get('pricing_type'),
            featured_image=request.POST.get('featured_image'),
            features=request.POST.getlist('features'),
            tags=request.POST.getlist('tags'),
        )
        
        # Handle pricing based on type
        if product.pricing_type == 'fixed':
            product.price = request.POST.get('price')
        elif product.pricing_type == 'subscription':
            product.subscription_price = request.POST.get('subscription_price')
            product.subscription_interval = request.POST.get('subscription_interval')
        
        product.available_quantity = request.POST.get('available_quantity')
        product.is_limited_edition = request.POST.get('is_limited_edition') == 'on'
        product.save()
        
        return redirect('product-detail', product_id=product.id)
    
    context = {
        'categories': Product.CATEGORY_CHOICES,
        'pricing_types': Product.PRICING_TYPE_CHOICES,
    }
    return render(request, 'marketplace/product_create.html', context)


@login_required
def product_edit(request, product_id):
    """Edit an existing product listing."""
    product = get_object_or_404(Product, id=product_id)
    
    # Check permissions
    if product.created_by != request.user:
        return redirect('product-detail', product_id=product.id)
    
    if request.method == 'POST':
        product.title = request.POST.get('title')
        product.description = request.POST.get('description')
        product.category = request.POST.get('category')
        product.pricing_type = request.POST.get('pricing_type')
        product.featured_image = request.POST.get('featured_image')
        product.features = request.POST.getlist('features')
        product.tags = request.POST.getlist('tags')
        
        if product.pricing_type == 'fixed':
            product.price = request.POST.get('price')
        elif product.pricing_type == 'subscription':
            product.subscription_price = request.POST.get('subscription_price')
            product.subscription_interval = request.POST.get('subscription_interval')
        
        product.available_quantity = request.POST.get('available_quantity')
        product.is_limited_edition = request.POST.get('is_limited_edition') == 'on'
        product.save()
        
        return redirect('product-detail', product_id=product.id)
    
    context = {
        'product': product,
        'categories': Product.CATEGORY_CHOICES,
        'pricing_types': Product.PRICING_TYPE_CHOICES,
    }
    return render(request, 'marketplace/product_edit.html', context)


@login_required
def product_publish(request, product_id):
    """Publish a draft product."""
    product = get_object_or_404(Product, id=product_id)
    
    if product.created_by != request.user:
        return redirect('product-detail', product_id=product.id)
    
    if request.method == 'POST':
        product.status = 'published'
        product.published_at = timezone.now()
        product.save()
        return redirect('product-detail', product_id=product.id)
    
    return redirect('product-detail', product_id=product.id)


@login_required
def product_archive(request, product_id):
    """Archive a product listing."""
    product = get_object_or_404(Product, id=product_id)
    
    if product.created_by != request.user:
        return redirect('product-detail', product_id=product.id)
    
    if request.method == 'POST':
        product.status = 'archived'
        product.save()
        return redirect('my-products')
    
    return redirect('product-detail', product_id=product.id)


@login_required
def my_products(request):
    """View user's own product listings."""
    products = Product.objects.filter(
        created_by=request.user
    ).select_related('tenant').annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews'),
        order_count=Count('orders')
    )
    
    context = {
        'products': products,
        'draft_products': products.filter(status='draft'),
        'published_products': products.filter(status='published'),
        'archived_products': products.filter(status='archived'),
    }
    return render(request, 'marketplace/my_products.html', context)


@login_required
def saved_products(request):
    """View user's saved/bookmarked products."""
    saved = SavedProduct.objects.filter(
        user=request.user
    ).select_related('product__tenant').order_by('-saved_at')
    
    products = [s.product for s in saved]
    
    context = {
        'products': products,
        'saved_count': len(products),
    }
    return render(request, 'marketplace/saved_products.html', context)


@login_required
@require_http_methods(["POST"])
def save_product(request, product_id):
    """Save/bookmark a product."""
    product = get_object_or_404(Product, id=product_id)
    
    saved, created = SavedProduct.objects.get_or_create(
        user=request.user,
        product=product
    )
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'saved': created,
            'saved_count': product.saved_by_users.count()
        })
    
    return redirect('product-detail', product_id=product.id)


@login_required
@require_http_methods(["POST"])
def unsave_product(request, product_id):
    """Remove a saved product."""
    product = get_object_or_404(Product, id=product_id)
    
    SavedProduct.objects.filter(
        user=request.user,
        product=product
    ).delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'saved': False,
            'saved_count': product.saved_by_users.count()
        })
    
    return redirect('product-detail', product_id=product.id)


@login_required
def review_create(request, product_id):
    """Create or update a review."""
    product = get_object_or_404(Product, id=product_id)
    tenant = request.user.tenantuser_set.first().tenant
    
    # Check if user has already reviewed
    existing_review = Review.objects.filter(
        product=product,
        reviewer=request.user,
        tenant=tenant
    ).first()
    
    if request.method == 'POST':
        rating = int(request.POST.get('rating', 0))
        title = request.POST.get('title')
        comment = request.POST.get('comment')
        
        if existing_review:
            existing_review.rating = rating
            existing_review.title = title
            existing_review.comment = comment
            existing_review.save()
        else:
            Review.objects.create(
                product=product,
                reviewer=request.user,
                tenant=tenant,
                rating=rating,
                title=title,
                comment=comment
            )
        
        # Update product rating
        avg_rating = product.reviews.aggregate(Avg('rating'))['rating__avg']
        product.rating = avg_rating or 0
        product.review_count = product.reviews.count()
        product.save()
        
        return redirect('product-detail', product_id=product.id)
    
    context = {
        'product': product,
        'existing_review': existing_review,
        'rating_choices': Review.RATING_CHOICES,
    }
    return render(request, 'marketplace/review_create.html', context)


@login_required
def order_create(request, product_id):
    """Create an order/purchase."""
    product = get_object_or_404(Product, id=product_id, status='published')
    buyer_tenant = request.user.tenantuser_set.first().tenant
    
    if request.method == 'POST':
        quantity = int(request.POST.get('quantity', 1))
        customer_message = request.POST.get('message', '')
        
        # Calculate pricing
        if product.pricing_type == 'free':
            unit_price = 0
        elif product.pricing_type == 'fixed':
            unit_price = product.price
        else:
            unit_price = product.subscription_price
        
        total_price = unit_price * quantity
        
        # Create order
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order.objects.create(
            order_number=order_number,
            product=product,
            buyer_tenant=buyer_tenant,
            buyer_user=request.user,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            customer_email=request.user.email,
            customer_message=customer_message,
            payment_status='pending' if total_price > 0 else 'completed',
            status='pending',
            access_token=uuid.uuid4().hex,
        )
        
        if total_price == 0:
            order.status = 'completed'
            order.completed_at = timezone.now()
            order.save()
        
        return redirect('order-detail', order_id=order.id)
    
    context = {
        'product': product,
    }
    return render(request, 'marketplace/order_create.html', context)


@login_required
def order_detail(request, order_id):
    """View order details."""
    order = get_object_or_404(Order, id=order_id)
    
    # Check permissions
    is_buyer = order.buyer_user == request.user
    is_seller = order.product.created_by == request.user
    
    if not (is_buyer or is_seller):
        return redirect('marketplace-home')
    
    context = {
        'order': order,
        'is_buyer': is_buyer,
        'is_seller': is_seller,
    }
    return render(request, 'marketplace/order_detail.html', context)


@login_required
def my_orders(request):
    """View user's purchase history."""
    orders = Order.objects.filter(
        buyer_user=request.user
    ).select_related('product__tenant').order_by('-created_at')
    
    context = {
        'orders': orders,
        'pending_orders': orders.filter(status='pending'),
        'completed_orders': orders.filter(status='completed'),
    }
    return render(request, 'marketplace/my_orders.html', context)


@login_required
def sales_dashboard(request):
    """View seller's sales analytics."""
    products = Product.objects.filter(created_by=request.user)
    orders = Order.objects.filter(product__in=products)
    
    total_sales = orders.filter(status='completed').count()
    total_revenue = sum(o.total_price for o in orders.filter(status='completed'))
    pending_orders = orders.filter(status='pending').count()
    
    recent_orders = orders.order_by('-created_at')[:10]
    
    context = {
        'products_count': products.count(),
        'total_sales': total_sales,
        'total_revenue': total_revenue,
        'pending_orders': pending_orders,
        'recent_orders': recent_orders,
        'products': products,
    }
    return render(request, 'marketplace/sales_dashboard.html', context)


@login_required
def conversation_list(request):
    """View user's marketplace conversations."""
    buyer_conversations = Conversation.objects.filter(
        buyer_tenant__tenantuser__user=request.user
    ).select_related('product', 'seller_tenant').distinct()
    
    seller_conversations = Conversation.objects.filter(
        seller_tenant__tenantuser__user=request.user
    ).select_related('product', 'buyer_tenant').distinct()
    
    conversations = (buyer_conversations | seller_conversations).order_by('-updated_at')
    
    context = {
        'conversations': conversations,
    }
    return render(request, 'marketplace/conversation_list.html', context)


@login_required
def conversation_detail(request, conversation_id):
    """View and interact with a marketplace conversation."""
    conversation = get_object_or_404(
        Conversation.objects.select_related('product', 'buyer_tenant', 'seller_tenant'),
        id=conversation_id
    )
    
    # Check permissions
    is_buyer = conversation.buyer_tenant.tenantuser_set.filter(user=request.user).exists()
    is_seller = conversation.seller_tenant.tenantuser_set.filter(user=request.user).exists()
    
    if not (is_buyer or is_seller):
        return redirect('conversation-list')
    
    messages = conversation.messages.select_related('sender').order_by('created_at')
    
    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        if content:
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
            conversation.updated_at = timezone.now()
            conversation.save()
    
    context = {
        'conversation': conversation,
        'messages': messages,
        'is_buyer': is_buyer,
        'is_seller': is_seller,
    }
    return render(request, 'marketplace/conversation_detail.html', context)


@login_required
def conversation_start(request, product_id):
    """Start a conversation about a product."""
    product = get_object_or_404(Product, id=product_id)
    buyer_tenant = request.user.tenantuser_set.first().tenant
    seller_tenant = product.tenant
    
    # Check if conversation already exists
    conversation, created = Conversation.objects.get_or_create(
        product=product,
        buyer_tenant=buyer_tenant,
        seller_tenant=seller_tenant,
        defaults={'subject': f"Inquiry about {product.title}"}
    )
    
    if request.method == 'POST':
        content = request.POST.get('content', '').strip()
        if content:
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
    
    return redirect('conversation-detail', conversation_id=conversation.id)
