from django.contrib import admin

from .models import DirectoryListing, PageMeta, SiteProfile


@admin.register(PageMeta)
class PageMetaAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title', 'is_indexable', 'updated_at')
    list_filter = ('is_indexable',)
    search_fields = ('slug', 'title', 'description')


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'domain', 'created_at')
    search_fields = ('name', 'domain')


@admin.register(DirectoryListing)
class DirectoryListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'is_active', 'updated_at')
    search_fields = ('name', 'url')
    list_filter = ('is_active',)
