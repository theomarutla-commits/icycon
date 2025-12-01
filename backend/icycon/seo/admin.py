from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Site, KeywordCluster, ContentItem, FAQ

admin.site.register(Site)
admin.site.register(KeywordCluster)
admin.site.register(ContentItem)
admin.site.register(FAQ)

# Register Backlinks models
from .models import Backlink, BacklinkProfile, CompetitorBacklink, LinkOpportunity, PressPitch, RepurposeJob, AeoChecklistItem, FreeZoneIdea

@admin.register(Backlink)
class BacklinkAdmin(admin.ModelAdmin):
    list_display = ('source_url', 'target_url', 'domain_rating', 'status', 'is_dofollow', 'site')
    list_filter = ('status', 'is_dofollow', 'site', 'first_seen')
    search_fields = ('source_url', 'target_url', 'anchor_text')
    readonly_fields = ('first_seen',)


@admin.register(BacklinkProfile)
class BacklinkProfileAdmin(admin.ModelAdmin):
    list_display = ('site', 'total_backlinks', 'unique_domains', 'avg_domain_rating')
    readonly_fields = ('site', 'last_updated')


@admin.register(CompetitorBacklink)
class CompetitorBacklinkAdmin(admin.ModelAdmin):
    list_display = ('competitor_domain', 'source_url', 'domain_rating', 'site')
    list_filter = ('competitor_domain', 'site', 'is_dofollow')
    search_fields = ('source_url', 'target_url', 'competitor_domain')


@admin.register(LinkOpportunity)
class LinkOpportunityAdmin(admin.ModelAdmin):
    list_display = ('prospect_domain', 'priority', 'status', 'relevance_score', 'site')
    list_filter = ('status', 'priority', 'site', 'created_at')
    search_fields = ('prospect_domain', 'contact_email', 'prospect_url')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PressPitch)
class PressPitchAdmin(admin.ModelAdmin):
    list_display = ('outlet', 'pitch_subject', 'status', 'sent_at', 'follow_up_at')
    list_filter = ('status', 'sent_at')
    search_fields = ('outlet', 'contact_email', 'pitch_subject')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(RepurposeJob)
class RepurposeJobAdmin(admin.ModelAdmin):
    list_display = ('source_url', 'status', 'scheduled_for', 'completed_at')
    list_filter = ('status',)
    search_fields = ('source_url',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(AeoChecklistItem)
class AeoChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'tenant', 'updated_at')
    list_filter = ('status', 'tenant')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(FreeZoneIdea)
class FreeZoneIdeaAdmin(admin.ModelAdmin):
    list_display = ('title', 'idea_type', 'status', 'effort', 'tenant')
    list_filter = ('idea_type', 'status', 'effort', 'tenant')
    search_fields = ('title',)
    readonly_fields = ('created_at', 'updated_at')
