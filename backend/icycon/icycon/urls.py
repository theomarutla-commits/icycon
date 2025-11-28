from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from users.auth_views import SignupView, LoginView
from users.views import profile_dashboard
from . import api_views as views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/signup', SignupView.as_view(), name='api_signup'),
    path('api/auth/login', LoginView.as_view(), name='api_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("", views.api_home, name="api-home"),
    path("api/features/", views.feature_index, name="feature-index"),
    path("api/dashboard/", views.dashboard, name="dashboard"),
    path("api/aso/apps/", views.aso_apps, name="aso-apps"),
    path("api/aso/apps/<int:app_id>/", views.aso_app_detail, name="aso-app-detail"),
    path("api/aso/keywords/", views.aso_keywords, name="aso-keywords"),
    path("api/aso/listings/", views.aso_listings, name="aso-listings"),
    path("api/marketplace/products/", views.marketplace_products, name="marketplace-products"),
    path(
        "api/marketplace/products/<int:product_id>/",
        views.marketplace_product_detail,
        name="marketplace-product-detail",
    ),
    path("api/marketplace/reviews/", views.marketplace_reviews, name="marketplace-reviews"),
    path(
        "api/marketplace/reviews/<int:review_id>/",
        views.marketplace_review_detail,
        name="marketplace-review-detail",
    ),
    path("api/marketplace/orders/", views.marketplace_orders, name="marketplace-orders"),
    path("api/marketplace/saved/", views.marketplace_saved_products, name="marketplace-saved"),
    path(
        "api/marketplace/conversations/",
        views.marketplace_conversations,
        name="marketplace-conversations",
    ),
    path("api/marketplace/messages/", views.marketplace_messages, name="marketplace-messages"),
    path("api/analytics/sites/", views.analytics_sites, name="analytics-sites"),
    path("api/analytics/sites/<int:site_id>/", views.analytics_site_detail, name="analytics-site-detail"),
    path("api/analytics/pageviews/", views.analytics_pageviews, name="analytics-pageviews"),
    path("api/multilingual/summary/", views.multilingual_summary, name="multilingual-summary"),
    path("api/tenants/summary/", views.tenant_summary, name="tenants-summary"),
    path("api/tenants/<int:tenant_id>/members/", views.tenant_members, name="tenant-members"),
    path("api/tenants/integrations/", views.tenant_integrations, name="tenant-integrations"),
    path("api/seo/sites/", views.seo_sites, name="seo-sites"),
    path("api/seo/sites/<int:site_id>/", views.seo_site_detail, name="seo-site-detail"),
    path("api/seo/keywords/", views.seo_keyword_clusters, name="seo-keywords"),
    path("api/seo/content/", views.seo_content_items, name="seo-content"),
    path("api/seo/faqs/", views.seo_faqs, name="seo-faqs"),
    path("api/seo/backlinks/", views.seo_backlinks, name="seo-backlinks"),
    path("api/seo/directories/", views.seo_directories, name="seo-directories"),
    path("api/social/accounts/", views.social_accounts, name="social-accounts"),
    path("api/social/posts/", views.social_posts, name="social-posts"),
    path("api/social/conversations/", views.social_conversations, name="social-conversations"),
    path("api/social/comments/", views.social_comments, name="social-comments"),
    path("api/social/engagement/", views.social_engagement, name="social-engagement"),
    path("api/social/messages/", views.social_messages, name="social-messages"),
    path("api/email/lists/", views.email_lists, name="email-lists"),
    path("api/email/templates/", views.email_templates, name="email-templates"),
    path("api/email/flows/", views.email_flows, name="email-flows"),
    path("api/email/contacts/", views.email_contacts, name="email-contacts"),
    path("api/email/sends/", views.email_sends, name="email-sends"),
    path("api/email/marketing/", views.email_marketing_summary, name="email-marketing-summary"),
    path("api/translate/", views.translate_text, name="translate-text"),
    path("api/geo/lookup/", views.geo_lookup, name="geo-lookup"),
    path('api/chat/', include('chatbot.urls')),
    path('', include('users.urls')),
    path('api/profile', profile_dashboard, name='api_profile'),  # current user profile fetch/update
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
