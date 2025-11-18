from __future__ import annotations

from .models import Backlink, DirectoryListing, PageMeta, SiteProfile


def seo_dashboard_summary(request):
    """Provide global counts for the SEO dashboard widgets."""
    summary = {
        'pages_count': PageMeta.objects.count(),
        'backlinks_count': Backlink.objects.count(),
        'sites_count': SiteProfile.objects.count(),
        'directories_count': DirectoryListing.objects.count(),
    }
    return {'seo_summary': summary}
