from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteViewSet,
    KeywordClusterViewSet,
    ContentItemViewSet,
    FAQViewSet,
    seo_dashboard,
    seo_sites_list,
    seo_site_detail,
    seo_site_create,
    seo_site_edit,
    seo_keyword_clusters,
    seo_content_items,
    seo_faqs,
    seo_backlinks_dashboard,
    seo_backlinks_analysis,
    seo_backlinks_competitors,
    seo_backlinks_outreach,
)

router = DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'keywords', KeywordClusterViewSet)
router.register(r'content-items', ContentItemViewSet)
router.register(r'faqs', FAQViewSet)

urlpatterns = [
    # API endpoints (DRF viewsets)
    path('', include(router.urls)),
    # Tenant-facing UI (server-rendered pages)
    # Backwards-compatible shorter URLs (e.g. /seo/sites/)
    path('sites/', seo_sites_list, name='seo_sites'),
    path('sites/create/', seo_site_create, name='seo_site_create'),
    path('sites/<int:site_id>/', seo_site_detail, name='seo_site_detail'),
    path('sites/<int:site_id>/edit/', seo_site_edit, name='seo_site_edit'),
    path('keywords/', seo_keyword_clusters, name='seo_keyword_clusters'),
    path('content-items/', seo_content_items, name='seo_content_items'),
    path('faqs/', seo_faqs, name='seo_faqs'),
    
    # Backlinks paths (consolidated from old backlinks app)
    path('backlinks/', seo_backlinks_dashboard, name='seo_backlinks_dashboard'),
    path('backlinks/analysis/', seo_backlinks_analysis, name='seo_backlinks_analysis'),
    path('backlinks/competitors/', seo_backlinks_competitors, name='seo_backlinks_competitors'),
    path('backlinks/outreach/', seo_backlinks_outreach, name='seo_backlinks_outreach'),

    # UI group for future use
    path('ui/', include([
        path('', seo_dashboard, name='seo_dashboard'),
        path('', seo_dashboard),
        path('sites/', seo_sites_list),
        path('sites/create/', seo_site_create),
        path('sites/<int:site_id>/', seo_site_detail),
        path('sites/<int:site_id>/edit/', seo_site_edit),
        path('keywords/', seo_keyword_clusters),
        path('content-items/', seo_content_items),
        path('faqs/', seo_faqs),
        path('backlinks/', seo_backlinks_dashboard),
        path('backlinks/analysis/', seo_backlinks_analysis),
        path('backlinks/competitors/', seo_backlinks_competitors),
        path('backlinks/outreach/', seo_backlinks_outreach),
    ])),
]
