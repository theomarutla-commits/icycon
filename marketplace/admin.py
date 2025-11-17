from django.contrib import admin

from .models import Interaction, ProductService, Sale


@admin.register(ProductService)
class ProductServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'kind', 'owner', 'price', 'is_active', 'updated_at')
    list_filter = ('kind', 'is_active', 'owner')
    search_fields = ('name', 'description', 'owner__username')


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'total_price', 'recorded_at')
    list_filter = ('recorded_at',)


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ('product', 'channel', 'created_at')
    list_filter = ('channel',)
