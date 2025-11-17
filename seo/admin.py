from django.contrib import admin

from .models import PageMeta


@admin.register(PageMeta)
class PageMetaAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title', 'is_indexable', 'updated_at')
    list_filter = ('is_indexable',)
    search_fields = ('slug', 'title', 'description')
