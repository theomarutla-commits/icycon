from django.contrib import admin
from .models import SocialAccount, Post, Engagement, Comment

@admin.register(SocialAccount)
class SocialAccountAdmin(admin.ModelAdmin):
    list_display = ('handle', 'platform', 'tenant', 'connected_at')
    list_filter = ('platform', 'tenant')
    search_fields = ('handle', 'tenant__name')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'tenant', 'author', 'post_type', 'status', 'created_at', 'published_at')
    list_filter = ('status', 'post_type', 'is_sponsored', 'tenant')
    search_fields = ('title', 'content', 'author__username', 'tenant__name')
    readonly_fields = ('created_at', 'updated_at', 'published_at')
    fieldsets = (
        (None, {
            'fields': ('tenant', 'author', 'title', 'content', 'excerpt')
        }),
        ('Post Settings', {
            'fields': ('post_type', 'status', 'platforms', 'scheduled_at')
        }),
        ('Media & Attachments', {
            'fields': ('media_attachments',)
        }),
        ('Advertisement Settings', {
            'fields': ('is_sponsored', 'target_audience', 'ad_budget', 'campaign_id'),
            'classes': ('collapse',)
        }),
        ('SEO Settings', {
            'fields': ('tags', 'meta_description', 'seo_keywords'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Engagement)
class EngagementAdmin(admin.ModelAdmin):
    list_display = ('post', 'platform', 'likes', 'shares', 'comments', 'impressions', 'timestamp')
    list_filter = ('platform', 'timestamp')
    search_fields = ('post__title',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at', 'is_approved')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'author__username', 'post__title')
