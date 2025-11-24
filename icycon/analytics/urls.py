from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sites', views.SiteViewSet, basename='site')
router.register(r'keyword-clusters', views.KeywordClusterViewSet, basename='keyword-cluster')
router.register(r'content-items', views.ContentItemViewSet, basename='content-item')
router.register(r'faqs', views.FAQViewSet, basename='faq')

urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # Server-rendered views
    path('', views.dashboard, name='analytics_dashboard'),
    path('sites/', views.site_list, name='site_list'),
    path('sites/<int:site_id>/', views.site_detail, name='site_detail'),
    path('sites/create/', views.site_create, name='site_create'),
    path('sites/<int:site_id>/edit/', views.site_edit, name='site_edit'),
    path('keyword-clusters/', views.keyword_clusters, name='analytics_keyword_clusters'),
    path('content-items/', views.content_items, name='analytics_content_items'),
    path('faqs/', views.faqs, name='analytics_faqs'),
]