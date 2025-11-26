from django.contrib import admin
from .models import Product, Review, Order, SavedProduct, Conversation, Message


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'tenant', 'category', 'status', 'pricing_type', 'price', 'created_at')
    list_filter = ('status', 'category', 'pricing_type', 'created_at')
    search_fields = ('title', 'description', 'tenant__name')
    readonly_fields = ('created_at', 'updated_at', 'published_at', 'rating', 'review_count')
    fieldsets = (
        ('Basic Information', {
            'fields': ('tenant', 'created_by', 'title', 'description', 'category', 'status')
        }),
        ('Media', {
            'fields': ('featured_image', 'images')
        }),
        ('Pricing', {
            'fields': ('pricing_type', 'price', 'subscription_price', 'subscription_interval')
        }),
        ('Details', {
            'fields': ('features', 'tags', 'available_quantity', 'is_limited_edition')
        }),
        ('Performance', {
            'fields': ('rating', 'review_count', 'created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'reviewer', 'rating', 'created_at')
    list_filter = ('rating', 'created_at', 'verified_purchase')
    search_fields = ('product__title', 'reviewer__username', 'title', 'comment')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'product', 'buyer_tenant', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'product__title', 'buyer_tenant__name', 'customer_email')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'access_token')


@admin.register(SavedProduct)
class SavedProductAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'saved_at')
    list_filter = ('saved_at',)
    search_fields = ('user__username', 'product__title')
    readonly_fields = ('saved_at',)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('product', 'buyer_tenant', 'seller_tenant', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('product__title', 'buyer_tenant__name', 'seller_tenant__name')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('conversation__product__title', 'sender__username', 'content')
    readonly_fields = ('created_at', 'updated_at')
