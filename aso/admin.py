from django.contrib import admin

from .models import AppListing, AppMetric


@admin.register(AppListing)
class AppListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'owner', 'rating', 'downloads', 'last_updated')
    search_fields = ('name', 'bundle_id', 'owner__username')
    list_filter = ('store',)


@admin.register(AppMetric)
class AppMetricAdmin(admin.ModelAdmin):
    list_display = ('listing', 'field', 'value', 'recorded_at')
    list_filter = ('field',)
