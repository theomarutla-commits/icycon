from __future__ import annotations

from .models import Backlink, DirectoryListing, PageMeta, SiteProfile


SEO_SUMMARY_DEFAULT = {
    'pages_count': 0,
    'backlinks_count': 0,
    'sites_count': 0,
    'directories_count': 0,
}


def seo_dashboard_summary(request):
    """Provide global counts for the SEO dashboard widgets."""
    summary = {
        'pages_count': PageMeta.objects.count(),
        'backlinks_count': Backlink.objects.count(),
        'sites_count': SiteProfile.objects.count(),
        'directories_count': DirectoryListing.objects.count(),
    }
    return {
        'seo_summary': summary,
        'seo_summary_default': SEO_SUMMARY_DEFAULT,
    }
