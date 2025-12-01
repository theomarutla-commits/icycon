from uuid import uuid4
from decimal import Decimal
from io import BytesIO

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.http import HttpResponse
from django.utils.text import slugify
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from PIL import Image, ImageDraw, ImageFont

from analytics.models import Site, ContentItem, PageView
from aso.models import App as ASOApp, AppKeyword, AppListing
from email_engine.models import Contact, EmailFlow, EmailList, EmailSend, EmailTemplate, Lead, SmsMessage, EmailCampaign
from marketplace.models import (
    Conversation as MarketplaceConversation,
    Message as MarketplaceMessage,
    Order,
    Product,
    Review,
    SavedProduct,
)
from seo.models import FAQ as SEOFAQ
from seo.models import ContentItem as SEOContentItem
from seo.models import Directory as SEODirectory
from seo.models import KeywordCluster as SEOKeywordCluster
from seo.models import Site as SEOSite
from seo.models import Backlink, PressPitch, RepurposeJob, AeoChecklistItem, FreeZoneIdea
from social_media.models import (
    Comment,
    Conversation as SocialConversation,
    Engagement,
    Message as SocialMessage,
    Post,
    SocialAccount,
)
from tenants.models import Tenant, TenantUser
from email_engine.services.delivery_providers import send_via_provider
from email_engine.services.sms_providers import send_sms_via_provider
from textwrap import dedent
from datetime import timedelta
from users.models import PasswordResetToken
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

FEATURES_INDEX = [
    # Platform / global
    {"key": "dashboard", "slug": "seo", "name": "Dashboard", "path": "/api/dashboard/", "description": "User overview and counts"},
    {"key": "leads", "slug": "crm", "name": "Leads", "path": "/api/leads/", "description": "Capture and review inbound leads"},
    # AEO
    {"key": "aeo_readiness", "slug": "aeo", "name": "AEO Readiness", "path": "/api/aeo/readiness/", "description": "AEO/LLM structured data readiness checklist"},
    {"key": "translation_llm", "slug": "aeo", "name": "Translation & LLM", "path": "/api/translate/", "description": "Translate supplied text (stubbed LLM)"},
    # Social
    {"key": "social_accounts", "slug": "social", "name": "Social Accounts", "path": "/api/social/accounts/", "description": "Connected social accounts"},
    {"key": "social_posts", "slug": "social", "name": "Social Posts", "path": "/api/social/posts/", "description": "Posts across platforms"},
    {"key": "social_conversations", "slug": "social", "name": "Social Conversations", "path": "/api/social/conversations/", "description": "DM threads"},
    {"key": "social_comments", "slug": "social", "name": "Social Comments", "path": "/api/social/comments/", "description": "Post comments"},
    {"key": "social_engagement", "slug": "social", "name": "Social Engagement", "path": "/api/social/engagement/", "description": "Engagement metrics"},
    {"key": "social_messages", "slug": "social", "name": "Social Messages", "path": "/api/social/messages/", "description": "Conversation messages"},
    # Email
    {"key": "email_lists", "slug": "email", "name": "Email Lists", "path": "/api/email/lists/", "description": "Subscriber lists"},
    {"key": "email_templates", "slug": "email", "name": "Email Templates", "path": "/api/email/templates/", "description": "Email templates"},
    {"key": "email_flows", "slug": "email", "name": "Email Flows", "path": "/api/email/flows/", "description": "Automation flows"},
    {"key": "email_contacts", "slug": "email", "name": "Email Contacts", "path": "/api/email/contacts/", "description": "Contacts"},
    {"key": "email_sends", "slug": "email", "name": "Email Sends", "path": "/api/email/sends/", "description": "Send history"},
    {"key": "email_campaigns", "slug": "email", "name": "Email Campaigns", "path": "/api/email/campaigns/", "description": "Campaign scheduling and sends"},
    {"key": "sms_messages", "slug": "email", "name": "SMS Messages", "path": "/api/email/sms/", "description": "Outbound SMS"},
    {"key": "email_marketing_summary", "slug": "email", "name": "Email Marketing", "path": "/api/email/marketing/", "description": "Email marketing overview"},
    {"key": "password_reset", "slug": "auth", "name": "Password Reset", "path": "/api/auth/request-reset", "description": "Request password reset"},
    {"key": "password_reset_confirm", "slug": "auth", "name": "Reset Confirm", "path": "/api/auth/confirm-reset", "description": "Confirm password reset"},
    {"key": "usage", "slug": "billing", "name": "Usage & Limits", "path": "/api/usage/", "description": "Usage stats for billing"},
    {"key": "tasks_status", "slug": "tasks", "name": "Tasks Status", "path": "/api/tasks/status/", "description": "Scheduled jobs overview"},
    {"key": "usage", "slug": "billing", "name": "Usage & Limits", "path": "/api/usage/", "description": "Usage stats for billing"},
    {"key": "tasks_status", "slug": "tasks", "name": "Tasks Status", "path": "/api/tasks/status/", "description": "Scheduled jobs overview"},
    # Multilingual
    {"key": "multilingual_summary", "slug": "multilingual", "name": "Multilingual Summary", "path": "/api/multilingual/summary/", "description": "Content locales summary"},
    # Backlinks & directories
    {"key": "seo_backlinks", "slug": "backlinks", "name": "SEO Backlinks", "path": "/api/seo/backlinks/", "description": "Backlinks for your SEO sites"},
    {"key": "seo_directories", "slug": "directories", "name": "SEO Directories", "path": "/api/seo/directories/", "description": "Directory listings/citations"},
    {"key": "press_pitches", "slug": "seo", "name": "Press Pitches", "path": "/api/seo/pr-pitches/", "description": "PR outreach tracking"},
    # Free zone (stub ideas)
    {"key": "free_zone", "slug": "free-zone", "name": "Free Zone", "path": "/api/free-zone/", "description": "Microtool and campaign ideas (stub)"},
    # ASO
    {"key": "aso_apps", "slug": "aso", "name": "ASO Apps", "path": "/api/aso/apps/", "description": "List ASO apps you manage"},
    {"key": "aso_app_detail", "slug": "aso", "name": "ASO App Detail", "path": "/api/aso/apps/<app_id>/", "description": "Single app details"},
    {"key": "aso_keywords", "slug": "aso", "name": "ASO Keywords", "path": "/api/aso/keywords/", "description": "Tracked keywords across apps"},
    {"key": "aso_listings", "slug": "aso", "name": "ASO Listings", "path": "/api/aso/listings/", "description": "Localized store listings"},
    # Marketplace
    {"key": "marketplace_products", "slug": "marketplace", "name": "Marketplace Products", "path": "/api/marketplace/products/", "description": "Products you sell"},
    {"key": "marketplace_product_detail", "slug": "marketplace", "name": "Marketplace Product Detail", "path": "/api/marketplace/products/<product_id>/", "description": "Single product with reviews"},
    {"key": "marketplace_reviews", "slug": "marketplace", "name": "Marketplace Reviews", "path": "/api/marketplace/reviews/", "description": "All reviews for your products"},
    {"key": "marketplace_review_detail", "slug": "marketplace", "name": "Marketplace Review Detail", "path": "/api/marketplace/reviews/<review_id>/", "description": "Single review"},
    {"key": "marketplace_orders", "slug": "marketplace", "name": "Marketplace Orders", "path": "/api/marketplace/orders/", "description": "Orders where you are buyer or seller"},
    {"key": "marketplace_saved", "slug": "marketplace", "name": "Saved Products", "path": "/api/marketplace/saved/", "description": "Saved products/bookmarks"},
    {"key": "marketplace_conversations", "slug": "marketplace", "name": "Marketplace Conversations", "path": "/api/marketplace/conversations/", "description": "Buyer/seller conversations"},
    {"key": "marketplace_messages", "slug": "marketplace", "name": "Marketplace Messages", "path": "/api/marketplace/messages/", "description": "Conversation messages"},
    # Analytics/SEO/content
    {"key": "analytics_sites", "slug": "seo", "name": "Analytics Sites", "path": "/api/analytics/sites/", "description": "Tracked sites"},
    {"key": "analytics_site_detail", "slug": "seo", "name": "Analytics Site Detail", "path": "/api/analytics/sites/<site_id>/", "description": "Single site stats"},
    {"key": "analytics_pageviews", "slug": "seo", "name": "Analytics Pageviews", "path": "/api/analytics/pageviews/", "description": "Recent pageviews"},
    {"key": "tenants_summary", "slug": "seo", "name": "Tenants Summary", "path": "/api/tenants/summary/", "description": "Tenants you belong to"},
    {"key": "tenant_members", "slug": "seo", "name": "Tenant Members", "path": "/api/tenants/<tenant_id>/members/", "description": "Members in a tenant"},
    {"key": "tenant_integrations", "slug": "seo", "name": "Tenant Integrations", "path": "/api/tenants/integrations/", "description": "Connected integrations"},
    {"key": "seo_sites", "slug": "seo", "name": "SEO Sites", "path": "/api/seo/sites/", "description": "SEO-tracked sites"},
    {"key": "seo_site_detail", "slug": "seo", "name": "SEO Site Detail", "path": "/api/seo/sites/<site_id>/", "description": "Single SEO site"},
    {"key": "seo_keyword_clusters", "slug": "content", "name": "SEO Keyword Clusters", "path": "/api/seo/keywords/", "description": "Keyword clusters"},
    {"key": "seo_content_items", "slug": "content", "name": "SEO Content", "path": "/api/seo/content/", "description": "Content items"},
    {"key": "seo_faqs", "slug": "aeo", "name": "SEO FAQs", "path": "/api/seo/faqs/", "description": "FAQ entries"},
    {"key": "seo_repurpose", "slug": "content", "name": "Repurpose Jobs", "path": "/api/seo/repurpose/", "description": "Blog repurpose & scheduling"},
    {"key": "report_dashboard", "slug": "reports", "name": "Dashboard Report", "path": "/api/report/dashboard/", "description": "PDF summary of key metrics"},
    # Geo helper
    {"key": "geo_lookup", "slug": "seo", "name": "Geo Lookup", "path": "/api/geo/lookup/", "description": "Geocode an address (stub with optional OpenAI)"},
]


def iso(dt):
    return dt.isoformat() if dt else None


def get_user_tenant_ids(user):
    # Gracefully handle cases where tenant tables aren't present (e.g., before migrations)
    try:
        return list(TenantUser.objects.filter(user=user).values_list("tenant_id", flat=True))
    except Exception:
        return []


def get_primary_tenant(user):
    tenant_ids = get_user_tenant_ids(user)
    if not tenant_ids:
        return None
    return Tenant.objects.filter(id__in=tenant_ids).first()


def ensure_tenant(user):
    tenant = get_primary_tenant(user)
    if not tenant:
        return None, Response({"error": "User is not assigned to a tenant"}, status=400)
    return tenant, None


@api_view(["GET"])
@permission_classes([AllowAny])
def api_home(request):
    """Landing endpoint that surfaces auth and feature links."""
    base = request.build_absolute_uri("/").rstrip("/")
    return Response(
        {
            "message": "Welcome to the Icycon API.",
            "auth": {
                "login": f"{base}/api/auth/login",
                "signup": f"{base}/api/auth/signup",
                "type": "basic or session",
                "basic_example": 'Authorization: Basic base64(email:password)',
            },
            "navigation": {
                "features": f"{base}/api/features/",
                "dashboard": f"{base}/api/dashboard/",
                "report": f"{base}/api/report/dashboard/",
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    tenant_ids = get_user_tenant_ids(user)
    def safe_count(qs):
        try:
            return qs.count()
        except Exception:
            return 0
    base = request.build_absolute_uri("/").rstrip("/")
    # Light summaries so the frontend can render user-specific data
    aso_apps_qs = ASOApp.objects.filter(tenant_id__in=tenant_ids) if tenant_ids else ASOApp.objects.none()
    marketplace_products_qs = Product.objects.filter(tenant_id__in=tenant_ids) if tenant_ids else Product.objects.none()
    features_payload = [
        {
            "key": item["key"],
            "name": item["name"],
            "description": item["description"],
            "endpoint": base + item["path"],
        }
        for item in FEATURES_INDEX
    ]

    return Response(
        {
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": user.avatar.url if getattr(user, "avatar", None) else None,
                "date_joined": iso(getattr(user, "date_joined", None)),
            },
            "aso_apps_count": safe_count(aso_apps_qs),
            "marketplace_products_count": safe_count(marketplace_products_qs),
            "aso_apps": [
                {
                    "id": app.id,
                    "name": app.name,
                    "platform": app.get_platform_display(),
                    "rating": app.rating,
                    "downloads_count": app.downloads_count,
                    "status": app.status,
                }
                for app in aso_apps_qs[:5]
            ],
            "marketplace_products": [
                {
                    "id": p.id,
                    "title": p.title,
                    "category": p.get_category_display(),
                    "price": float(p.price) if p.price else 0,
                    "status": p.status,
                }
                for p in marketplace_products_qs[:5]
            ],
            "features": features_payload,
            "recent_activities": [],
        }
    )


# ASO ----------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def aso_apps(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        name = request.data.get("name") or "New App"
        platform = request.data.get("platform") if request.data.get("platform") in dict(ASOApp.PLATFORM_CHOICES) else "ios"
        bundle_val = request.data.get("bundle_id") or f"{slugify(name) or 'app'}.{tenant.id}.{uuid4().hex[:6]}"
        developer = request.data.get("developer_name") or (request.user.get_full_name() or request.user.username or "Owner")
        description = request.data.get("description") or "App description to be updated."

        app = ASOApp.objects.create(
            tenant=tenant,
            name=name,
            bundle_id=bundle_val,
            platform=platform,
            developer_name=developer,
            icon_url=request.data.get("icon_url", ""),
            description=description,
            status=request.data.get("status", "draft"),
            category=request.data.get("category", "general"),
            rating=0,
            reviews_count=0,
            downloads_count=0,
        )
        return Response(
            {
                "id": app.id,
                "name": app.name,
                "platform": app.get_platform_display(),
                "bundle_id": app.bundle_id,
                "rating": app.rating,
                "reviews_count": app.reviews_count,
                "downloads_count": app.downloads_count,
                "category": app.category,
                "icon_url": app.icon_url,
                "status": app.status,
                "keywords_count": app.keywords.count(),
            },
            status=201,
        )

    apps = ASOApp.objects.filter(tenant=tenant)
    data = [
        {
            "id": app.id,
            "name": app.name,
            "platform": app.get_platform_display(),
            "bundle_id": app.bundle_id,
            "rating": app.rating,
            "reviews_count": app.reviews_count,
            "downloads_count": app.downloads_count,
            "category": app.category,
            "icon_url": app.icon_url,
            "status": app.status,
            "keywords_count": app.keywords.count(),
        }
        for app in apps
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def aso_app_detail(request, app_id):
    tenant_ids = get_user_tenant_ids(request.user)
    app = get_object_or_404(ASOApp, pk=app_id, tenant_id__in=tenant_ids)
    return Response(
        {
            "id": app.id,
            "name": app.name,
            "bundle_id": app.bundle_id,
            "platform": app.get_platform_display(),
            "rating": app.rating,
            "reviews_count": app.reviews_count,
            "downloads_count": app.downloads_count,
            "description": app.description,
            "category": app.category,
            "icon_url": app.icon_url,
            "status": app.status,
            "keywords": [
                {"id": k.id, "keyword": k.keyword, "position": k.position, "search_volume": k.search_volume}
                for k in app.keywords.all()
            ],
            "listings": [{"id": l.id, "locale": l.locale, "title": l.title} for l in app.listings.all()],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def aso_keywords(request):
    tenant_ids = get_user_tenant_ids(request.user)
    keywords = AppKeyword.objects.filter(app__tenant_id__in=tenant_ids)
    data = [
        {
            "id": k.id,
            "app_id": k.app.id,
            "app_name": k.app.name,
            "keyword": k.keyword,
            "position": k.position,
            "search_volume": getattr(k, "search_volume", 0),
            "tracking": getattr(k, "tracking", False),
        }
        for k in keywords
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def aso_listings(request):
    tenant_ids = get_user_tenant_ids(request.user)
    listings = AppListing.objects.filter(app__tenant_id__in=tenant_ids)
    if not listings.exists():
        return Response({})
    data = [
        {
            "id": l.id,
            "app_id": l.app.id,
            "app_name": l.app.name,
            "locale": getattr(l, "locale", "en"),
            "title": getattr(l, "title", "N/A"),
            "subtitle": getattr(l, "subtitle", ""),
            "description": (getattr(l, "description", "") or "")[:100] + "...",
        }
        for l in listings
    ]
    return Response(data)


# Marketplace --------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def marketplace_products(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        title = request.data.get("title") or "Untitled Product"
        price = request.data.get("price", 0) or 0
        category = request.data.get("category", "service")
        status_val = request.data.get("status", "draft")
        product = Product.objects.create(
            tenant=tenant,
            created_by=request.user,
            title=title,
            description=request.data.get("description", "Product description pending."),
            category=category if category in dict(Product.CATEGORY_CHOICES) else "other",
            status=status_val if status_val in dict(Product.STATUS_CHOICES) else "draft",
            featured_image=request.data.get("featured_image", ""),
            pricing_type=request.data.get("pricing_type", "fixed"),
            price=Decimal(price) if price else None,
            tags=request.data.get("tags", []),
            features=request.data.get("features", []),
        )
        return Response(
            {
                "id": product.id,
                "title": product.title,
                "category": product.get_category_display(),
                "status": product.status,
                "price": float(product.price) if product.price else 0,
                "pricing_type": product.get_pricing_type_display(),
                "featured_image": product.featured_image,
                "rating": float(product.rating),
                "review_count": product.review_count,
                "created_at": iso(product.created_at),
            },
            status=201,
        )

    products = Product.objects.filter(tenant=tenant)
    data = [
        {
            "id": product.id,
            "title": product.title,
            "category": product.get_category_display(),
            "status": product.status,
            "price": float(product.price) if product.price else 0,
            "pricing_type": product.get_pricing_type_display(),
            "featured_image": product.featured_image,
            "rating": float(product.rating),
            "review_count": product.review_count,
            "created_at": iso(product.created_at),
        }
        for product in products
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_product_detail(request, product_id):
    tenant_ids = get_user_tenant_ids(request.user)
    product = get_object_or_404(Product, pk=product_id, tenant_id__in=tenant_ids)
    reviews = product.reviews.all()
    return Response(
        {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "category": product.get_category_display(),
            "status": product.status,
            "price": float(product.price) if product.price else 0,
            "pricing_type": product.get_pricing_type_display(),
            "featured_image": product.featured_image,
            "images": product.images,
            "features": product.features,
            "tags": product.tags,
            "rating": float(product.rating),
            "review_count": product.review_count,
            "reviews": [
                {
                    "id": r.id,
                    "rating": r.rating,
                    "title": r.title,
                    "comment": r.comment,
                    "reviewer": r.reviewer.username,
                    "created_at": iso(r.created_at),
                }
                for r in reviews
            ],
            "created_at": iso(product.created_at),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_reviews(request):
    tenant_ids = get_user_tenant_ids(request.user)
    reviews = Review.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": r.id,
            "product_id": r.product.id,
            "product_title": r.product.title,
            "rating": r.rating,
            "title": r.title,
            "comment": r.comment[:200] + "..." if len(r.comment) > 200 else r.comment,
            "reviewer": r.reviewer.username,
            "verified_purchase": r.verified_purchase,
            "helpful_count": r.helpful_count,
            "created_at": iso(r.created_at),
        }
        for r in reviews
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_review_detail(request, review_id):
    tenant_ids = get_user_tenant_ids(request.user)
    review = get_object_or_404(Review, pk=review_id, tenant_id__in=tenant_ids)
    return Response(
        {
            "id": review.id,
            "product_id": review.product.id,
            "product_title": review.product.title,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "reviewer": review.reviewer.username,
            "verified_purchase": review.verified_purchase,
            "helpful_count": review.helpful_count,
            "created_at": iso(review.created_at),
            "updated_at": iso(review.updated_at),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_orders(request):
    tenant_ids = get_user_tenant_ids(request.user)
    orders = Order.objects.filter(Q(buyer_id__in=tenant_ids) | Q(seller_id__in=tenant_ids)).distinct()
    data = [
        {
            "id": o.id,
            "order_number": o.order_number,
            "product_title": o.product.title,
            "buyer": o.buyer.name,
            "seller": o.seller.name,
            "total_price": float(o.total_price) if o.total_price else 0,
            "status": o.status,
            "quantity": o.quantity,
            "created_at": iso(o.created_at),
        }
        for o in orders
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_saved_products(request):
    tenant_ids = get_user_tenant_ids(request.user)
    saved = SavedProduct.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": s.id,
            "product_id": s.product.id,
            "product_title": s.product.title,
            "product_price": float(s.product.price) if s.product.price else 0,
            "product_image": s.product.featured_image,
            "category": s.product.category,
            "rating": float(s.product.rating),
            "saved_at": iso(s.created_at),
        }
        for s in saved
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_conversations(request):
    tenant_ids = get_user_tenant_ids(request.user)
    conversations = MarketplaceConversation.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": c.id,
            "buyer": c.buyer.name if c.buyer else "Unknown",
            "seller": c.seller.name if c.seller else "Unknown",
            "product_title": c.product.title if c.product else "N/A",
            "message_count": c.marketplacemessage_set.count() if hasattr(c, "marketplacemessage_set") else 0,
            "last_message": iso(c.last_message_at) if hasattr(c, "last_message_at") else None,
            "created_at": iso(c.created_at),
        }
        for c in conversations
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_messages(request):
    tenant_ids = get_user_tenant_ids(request.user)
    messages = MarketplaceMessage.objects.filter(conversation__tenant_id__in=tenant_ids)[:100]
    data = [
        {
            "id": m.id,
            "conversation_id": m.conversation.id,
            "sender": m.sender.username if m.sender else "Unknown",
            "content": m.content[:200] + "..." if len(m.content) > 200 else m.content,
            "is_read": m.is_read,
            "created_at": iso(m.created_at),
        }
        for m in messages
    ]
    return Response(data)


# Analytics & SEO ----------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def feature_index(request):
    """Return a static list of available feature endpoints and what they provide."""
    base = request.build_absolute_uri("/")
    features = []
    for item in FEATURES_INDEX:
        path = item["path"]
        # Keep placeholders as-is so clients know what to substitute
        url = base.rstrip("/") + path
        features.append(
            {
                "key": item["key"],
                "name": item["name"],
                "description": item["description"],
                "endpoint": url,
            }
        )
    return Response({"features": features})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def analytics_sites(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        domain = request.data.get("domain") or "https://example.com"
        locale = request.data.get("default_locale", "en")
        site = Site.objects.create(
            tenant=tenant,
            domain=domain,
            default_locale=locale,
            sitemaps_url=request.data.get("sitemaps_url", ""),
            robots_txt=request.data.get("robots_txt", ""),
        )
        return Response(
            {
                "id": site.id,
                "domain": site.domain,
                "default_locale": site.default_locale,
                "created_at": iso(site.created_at),
                "pageview_count": site.pageview_set.count(),
            },
            status=201,
        )

    sites = Site.objects.filter(tenant=tenant)
    data = [
        {
            "id": site.id,
            "domain": site.domain,
            "default_locale": site.default_locale,
            "created_at": iso(site.created_at),
            "pageview_count": site.pageview_set.count(),
        }
        for site in sites
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_site_detail(request, site_id):
    tenant_ids = get_user_tenant_ids(request.user)
    site = get_object_or_404(Site, pk=site_id, tenant_id__in=tenant_ids)
    pageviews = site.pageview_set.all()[:50]
    return Response(
        {
            "id": site.id,
            "domain": site.domain,
            "default_locale": site.default_locale,
            "sitemaps_url": site.sitemaps_url,
            "robots_txt": site.robots_txt,
            "created_at": iso(site.created_at),
            "pageviews_count": site.pageview_set.count(),
            "recent_pageviews": [
                {"url": pv.url, "timestamp": iso(pv.timestamp), "duration": pv.duration, "bounce": pv.bounce}
                for pv in pageviews
            ],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_pageviews(request):
    tenant_ids = get_user_tenant_ids(request.user)
    pageviews = PageView.objects.filter(site__tenant_id__in=tenant_ids)[:100]
    data = [
        {
            "id": pv.id,
            "site_domain": pv.site.domain,
            "url": pv.url,
            "visitor_id": pv.visitor_id,
            "duration": pv.duration,
            "bounce": pv.bounce,
            "referrer": pv.referrer or "Direct",
            "timestamp": iso(pv.timestamp),
        }
        for pv in pageviews
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def multilingual_summary(request):
    tenant_ids = get_user_tenant_ids(request.user)
    content_items = ContentItem.objects.filter(tenant_id__in=tenant_ids)
    locales = set(content_items.values_list("locale", flat=True))
    return Response(
        {
            "locales": list(locales),
            "content_count": content_items.count(),
            "content_by_type": {
                "blog": content_items.filter(type="blog").count(),
                "faq": content_items.filter(type="faq").count(),
                "qapage": content_items.filter(type="qapage").count(),
                "product": content_items.filter(type="product").count(),
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tenant_summary(request):
    tenant_ids = get_user_tenant_ids(request.user)
    tenants = Tenant.objects.filter(id__in=tenant_ids)
    return Response(
        {
            "tenants": [
                {
                    "id": t.id,
                    "name": t.name,
                    "slug": getattr(t, "slug", None),
                    "created_at": iso(getattr(t, "created_at", None)),
                }
                for t in tenants
            ],
            "tenant_count": tenants.count(),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tenant_members(request, tenant_id):
    tenant_ids = get_user_tenant_ids(request.user)
    tenant = get_object_or_404(Tenant, id=tenant_id, id__in=tenant_ids)
    members = [request.user]
    return Response(
        {
            "tenant_id": tenant.id,
            "tenant_name": tenant.name,
            "members": [{"id": m.id, "username": m.username, "email": m.email} for m in members],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tenant_integrations(request):
    tenant_ids = get_user_tenant_ids(request.user)
    from tenants.models import Integration

    integrations = Integration.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": i.id,
            "name": i.name if hasattr(i, "name") else "Integration",
            "service": i.service if hasattr(i, "service") else "Unknown",
            "is_active": i.is_active if hasattr(i, "is_active") else True,
            "connected_at": iso(getattr(i, "connected_at", None)),
        }
        for i in integrations
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_sites(request):
    tenant_ids = get_user_tenant_ids(request.user)
    sites = SEOSite.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": s.id,
            "domain": s.domain,
            "sitemaps_url": s.sitemaps_url,
            "default_locale": s.default_locale,
            "domain_authority": 0,
            "backlink_count": s.backlinks.count() if hasattr(s, "backlinks") else 0,
            "indexed_pages": 0,
            "last_crawled": iso(getattr(s, "created_at", None)),
            "created_at": iso(getattr(s, "created_at", None)),
        }
        for s in sites
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_site_detail(request, site_id):
    tenant_ids = get_user_tenant_ids(request.user)
    site = get_object_or_404(SEOSite, pk=site_id, tenant_id__in=tenant_ids)
    return Response(
        {
            "id": site.id,
            "domain": site.domain,
            "sitemaps_url": site.sitemaps_url,
            "default_locale": site.default_locale,
            "robots_txt": site.robots_txt,
            "domain_authority": 0,
            "backlink_count": site.backlinks.count() if hasattr(site, "backlinks") else 0,
            "indexed_pages": 0,
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_keyword_clusters(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        intent = request.data.get("intent") or request.data.get("keyword") or "New intent"
        terms = request.data.get("terms") or []
        locale = request.data.get("locale", "en")
        if isinstance(terms, str):
            terms = [t.strip() for t in terms.split(",") if t.strip()]
        cluster = SEOKeywordCluster.objects.create(
            tenant=tenant,
            intent=intent,
            terms=terms if isinstance(terms, list) else [],
            locale=locale,
        )
        return Response(
            {
                "id": cluster.id,
                "intent": cluster.intent,
                "terms": cluster.terms,
                "locale": cluster.locale,
                "created_at": iso(cluster.created_at),
            },
            status=201,
        )

    clusters = SEOKeywordCluster.objects.filter(tenant=tenant)
    data = []
    for c in clusters:
        keyword_val = None
        if hasattr(c, "terms") and isinstance(c.terms, list) and c.terms:
            keyword_val = c.terms[0]
        else:
            keyword_val = getattr(c, "intent", "N/A") or "N/A"

        data.append(
            {
                "id": c.id,
                "keyword": keyword_val,
                "intent": getattr(c, "intent", "N/A"),
                "locale": getattr(c, "locale", "en"),
                "domain": getattr(c, "domain", "N/A"),
                "search_volume": 0,
                "difficulty": "Medium",
                "ranking": 0,
                "traffic_value": 0,
                "created_at": iso(getattr(c, "created_at", None)),
            }
        )
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_content_items(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        url = request.data.get("url") or "https://example.com"
        content_type = request.data.get("type", "blog")
        item = SEOContentItem.objects.create(
            tenant=tenant,
            type=content_type if content_type in dict(SEOContentItem.TYPE_CHOICES) else "blog",
            url=url,
            status=request.data.get("status", "draft"),
            locale=request.data.get("locale", "en"),
            brief_json=request.data.get("brief_json", {}),
            draft_html=request.data.get("draft_html", ""),
            json_ld=request.data.get("json_ld", ""),
        )
        return Response(
            {
                "id": item.id,
                "type": item.type,
                "url": item.url,
                "status": item.status,
                "locale": item.locale,
                "created_at": iso(item.created_at),
            },
            status=201,
        )

    items = SEOContentItem.objects.filter(tenant=tenant)
    data = [
        {"id": i.id, "type": i.type, "url": i.url, "status": i.status, "locale": i.locale, "created_at": iso(i.created_at)}
        for i in items
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_repurpose(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    if request.method == "POST":
        source_url = request.data.get("source_url") or ""
        formats = request.data.get("target_formats") or []
        if isinstance(formats, str):
            formats = [f.strip() for f in formats.split(",") if f.strip()]
        if not source_url:
            return Response({"error": "source_url is required"}, status=400)

        job = RepurposeJob.objects.create(
            tenant=tenant,
            source_url=source_url,
            target_formats=formats or ["twitter", "linkedin", "email"],
            status="scheduled",
            scheduled_for=request.data.get("scheduled_for"),
        )

        # Inline LLM repurpose (best-effort) using OpenAI if configured
        api_key = getattr(settings, "OPENAI_API_KEY", None)
        if api_key:
            try:
                import openai

                openai.api_key = api_key
                prompt = dedent(
                    f"""
                    Repurpose the following blog/article into social and email snippets.
                    Source URL: {source_url}
                    Target formats: {formats or ['twitter','linkedin','email']}
                    Return JSON with keys matching target formats and values as arrays of snippets (max 3 each), plus a short summary.
                    """
                )
                completion = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    temperature=0.6,
                    messages=[
                        {"role": "system", "content": "Return valid JSON only."},
                        {"role": "user", "content": prompt},
                    ],
                )
                import json

                parsed = json.loads(completion["choices"][0]["message"]["content"])
                job.outputs = parsed
                job.summary = parsed.get("summary", "")
                job.status = "done"
                job.completed_at = timezone.now()
                job.save()
            except Exception as exc:
                job.status = "failed"
                job.error = str(exc)
                job.save()

        return Response(
            {
                "id": job.id,
                "source_url": job.source_url,
                "target_formats": job.target_formats,
                "status": job.status,
                "scheduled_for": iso(job.scheduled_for),
                "completed_at": iso(job.completed_at),
                "outputs": job.outputs,
                "error": job.error,
            },
            status=201 if job.status != "failed" else 500,
        )

    jobs = RepurposeJob.objects.filter(tenant=tenant)
    data = [
        {
            "id": j.id,
            "source_url": j.source_url,
            "target_formats": j.target_formats,
            "status": j.status,
            "scheduled_for": iso(j.scheduled_for),
            "completed_at": iso(j.completed_at),
            "summary": j.summary,
            "error": j.error,
        }
        for j in jobs
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_faqs(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        question = request.data.get("question") or "New FAQ?"
        answer = request.data.get("answer") or ""
        faq = SEOFAQ.objects.create(
            tenant=tenant,
            question=question,
            answer=answer,
            source_urls=request.data.get("source_urls", []),
        )
        return Response(
            {
                "id": faq.id,
                "question": faq.question,
                "answer": faq.answer,
                "created_at": iso(faq.created_at),
            },
            status=201,
        )

    faqs = SEOFAQ.objects.filter(tenant=tenant)
    data = [
        {
            "id": f.id,
            "question": f.question,
            "answer": f.answer[:200] + "..." if len(f.answer) > 200 else f.answer,
            "created_at": iso(f.created_at),
        }
        for f in faqs
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_backlinks(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        site = None
        site_id = request.data.get("site_id")
        if site_id:
            site = SEOSite.objects.filter(id=site_id, tenant=tenant).first()
        if not site:
            site = SEOSite.objects.filter(tenant=tenant).first()
        if not site:
            site = SEOSite.objects.create(tenant=tenant, domain="https://example.com", default_locale="en")

        backlink = Backlink.objects.create(
            site=site,
            source_url=request.data.get("source_url", "https://source.example.com"),
            target_url=request.data.get("target_url", site.domain),
            anchor_text=request.data.get("anchor_text", ""),
            status=request.data.get("status", "active"),
            domain_rating=request.data.get("domain_rating", 0) or 0,
            page_authority=request.data.get("page_authority", 0) or 0,
            is_dofollow=request.data.get("is_dofollow", True),
        )
        return Response(
            {
                "id": backlink.id,
                "site_id": site.id,
                "domain": site.domain,
                "source_url": backlink.source_url,
                "target_url": backlink.target_url,
                "anchor_text": backlink.anchor_text,
                "status": backlink.status,
                "domain_rating": backlink.domain_rating,
                "created_at": iso(backlink.first_seen),
            },
            status=201,
        )

    if not hasattr(SEOSite, "backlinks"):
        return Response([])
    sites = SEOSite.objects.filter(tenant=tenant).prefetch_related("backlinks")
    backlinks = []
    for site in sites:
        for b in getattr(site, "backlinks").all():
            backlinks.append(
                {
                    "id": b.id,
                    "site_id": site.id,
                    "domain": site.domain,
                    "source_url": b.source_url,
                    "target_url": b.target_url,
                    "anchor_text": b.anchor_text,
                    "status": getattr(b, "status", "active"),
                    "domain_rating": getattr(b, "domain_rating", 0),
                    "created_at": iso(getattr(b, "first_seen", None)),
                }
            )
    return Response(backlinks)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def seo_directories(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        name = request.data.get("name")
        url = request.data.get("url")
        status_val = request.data.get("status", "submitted")
        if not name or not url:
            return Response({"error": "name and url are required"}, status=400)
        if not tenant_ids:
            return Response({"error": "No tenant associated with user"}, status=400)
        directory = SEODirectory.objects.create(
            tenant_id=tenant_ids[0],
            name=name,
            url=url,
            status=status_val if status_val in dict(SEODirectory.STATUS_CHOICES) else "submitted",
        )
        return Response(
            {
                "id": directory.id,
                "name": directory.name,
                "url": directory.url,
                "status": directory.status,
                "created_at": iso(directory.created_at),
            },
            status=201,
        )

    directories = SEODirectory.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": d.id,
            "name": d.name,
            "url": d.url,
            "status": d.status,
            "created_at": iso(d.created_at),
        }
        for d in directories
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def press_pitches(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    if request.method == "POST":
        outlet = request.data.get("outlet") or ""
        pitch_subject = request.data.get("pitch_subject") or ""
        pitch_body = request.data.get("pitch_body") or ""
        if not outlet or not pitch_subject or not pitch_body:
            return Response({"error": "outlet, pitch_subject, and pitch_body are required"}, status=400)

        tags = request.data.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]

        pitch = PressPitch.objects.create(
            tenant=tenant,
            outlet=outlet,
            contact_name=request.data.get("contact_name", ""),
            contact_email=request.data.get("contact_email", ""),
            pitch_subject=pitch_subject,
            pitch_body=pitch_body,
            status=request.data.get("status", "sent"),
            sent_at=request.data.get("sent_at"),
            follow_up_at=request.data.get("follow_up_at"),
            response_notes=request.data.get("response_notes", ""),
            article_url=request.data.get("article_url", ""),
            tags=tags,
            metadata=request.data.get("metadata", {}),
        )
        return Response(
            {
                "id": pitch.id,
                "outlet": pitch.outlet,
                "pitch_subject": pitch.pitch_subject,
                "status": pitch.status,
                "sent_at": iso(pitch.sent_at),
                "follow_up_at": iso(pitch.follow_up_at),
            },
            status=201,
        )

    pitches = PressPitch.objects.filter(tenant=tenant)
    data = [
        {
            "id": p.id,
            "outlet": p.outlet,
            "contact_email": p.contact_email,
            "pitch_subject": p.pitch_subject,
            "status": p.status,
            "sent_at": iso(p.sent_at),
            "follow_up_at": iso(p.follow_up_at),
            "article_url": p.article_url,
            "tags": p.tags,
        }
        for p in pitches
    ]
    return Response(data)


# Social -------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_accounts(request):
    tenant_ids = get_user_tenant_ids(request.user)
    accounts = SocialAccount.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": a.id,
            "username": a.handle,
            "platform": a.platform,
            "is_active": True,
            "follower_count": 0,
            "engagement_rate": "0%",
            "connected_at": iso(a.connected_at),
        }
        for a in accounts
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def social_posts(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        content = request.data.get("content") or ""
        title = request.data.get("title") or content[:50] or "New Post"
        scheduled_at = request.data.get("scheduled_at")
        status_val = request.data.get("status", "draft")
        if status_val == "scheduled" and scheduled_at and timezone.now() >= timezone.make_aware(timezone.datetime.fromisoformat(str(scheduled_at))):
            status_val = "published"
        published_at_val = timezone.now() if status_val == "published" else None
        post = Post.objects.create(
            tenant=tenant,
            author=request.user,
            title=title,
            content=content,
            excerpt=content[:140],
            post_type=request.data.get("post_type", "post"),
            category=request.data.get("category", "general"),
            status=status_val,
            platforms=request.data.get("platforms", [request.data.get("platform", "general")]),
            featured_image=request.data.get("featured_image", ""),
            scheduled_at=scheduled_at,
            published_at=published_at_val,
        )
        return Response(
            {
                "id": post.id,
                "content": post.content,
                "platform": post.platforms[0] if post.platforms else "general",
                "status": post.status,
                "created_at": iso(post.created_at),
                "posted_date": iso(post.published_at),
                "like_count": 0,
                "comment_count": 0,
                "share_count": 0,
            },
            status=201,
        )

    posts = Post.objects.filter(tenant=tenant)
    data = [
        {
            "id": p.id,
            "content": p.content[:200] + "..." if len(p.content) > 200 else p.content,
            "platform": p.platforms[0] if p.platforms else "general",
            "status": p.status,
            "created_at": iso(p.created_at),
            "posted_date": iso(p.published_at),
            "like_count": 0,
            "comment_count": p.comments.count(),
            "share_count": 0,
        }
        for p in posts
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_conversations(request):
    tenant_ids = get_user_tenant_ids(request.user)
    conversations = SocialConversation.objects.filter(account__tenant_id__in=tenant_ids)
    data = [
        {
            "id": c.id,
            "participant_name": c.subject or "Group Conversation",
            "last_message": c.messages.first().content[:100] + "..." if c.messages.exists() else "No messages",
            "unread": c.messages.filter(is_read=False).count(),
            "updated_at": iso(c.updated_at),
        }
        for c in conversations
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_comments(request):
    tenant_ids = get_user_tenant_ids(request.user)
    comments = Comment.objects.filter(post__tenant_id__in=tenant_ids)
    data = [
        {
            "id": c.id,
            "post_id": c.post.id,
            "post_title": c.post.title,
            "author": c.author.username,
            "content": c.content[:150] + "..." if len(c.content) > 150 else c.content,
            "is_approved": c.is_approved,
            "created_at": iso(c.created_at),
        }
        for c in comments
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_engagement(request):
    tenant_ids = get_user_tenant_ids(request.user)
    engagements = Engagement.objects.filter(post__tenant_id__in=tenant_ids)
    data = [
        {
            "id": e.id,
            "post_id": e.post.id,
            "post_title": e.post.title,
            "platform": e.platform,
            "likes": e.likes,
            "shares": e.shares,
            "comments": e.comments,
            "clicks": e.clicks,
            "impressions": e.impressions,
            "reach": e.reach,
            "timestamp": iso(e.timestamp),
        }
        for e in engagements
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_messages(request):
    tenant_ids = get_user_tenant_ids(request.user)
    messages = SocialMessage.objects.filter(conversation__account__tenant_id__in=tenant_ids)[:100]
    data = [
        {
            "id": m.id,
            "conversation_id": m.conversation.id,
            "sender_id": m.sender_id,
            "content": m.content[:200] + "..." if len(m.content) > 200 else m.content,
            "timestamp": iso(m.timestamp),
        }
        for m in messages
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def social_schedule(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    if request.method == "POST":
        content = request.data.get("content") or ""
        title = request.data.get("title") or content[:50] or "Scheduled Post"
        publish_at = request.data.get("publish_at")
        if not publish_at:
            return Response({"error": "publish_at is required"}, status=400)
        status_val = "scheduled"
        post = Post.objects.create(
            tenant=tenant,
            author=request.user,
            title=title,
            content=content,
            excerpt=content[:140],
            post_type=request.data.get("post_type", "post"),
            category=request.data.get("category", "general"),
            status=status_val,
            platforms=request.data.get("platforms", [request.data.get("platform", "general")]),
            featured_image=request.data.get("featured_image", ""),
            scheduled_at=publish_at,
        )
        return Response({"id": post.id, "status": post.status, "scheduled_at": iso(post.scheduled_at)}, status=201)

    # GET: process due scheduled posts and report counts
    due = Post.objects.filter(tenant=tenant, status="scheduled", scheduled_at__lte=timezone.now())
    published = 0
    for p in due:
        p.status = "published"
        p.published_at = timezone.now()
        p.save()
        published += 1
    pending = Post.objects.filter(tenant=tenant, status="scheduled").count()
    return Response({"published_now": published, "pending": pending})


# Leads --------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def leads(request):
    """
    Capture inbound leads (public POST) and allow authenticated users to review them (GET).
    If the user is authenticated, the lead is associated to their tenant when available.
    """
    if request.method == "POST":
        email_val = (request.data.get("email") or "").strip()
        if not email_val:
            return Response({"error": "email is required"}, status=400)

        tenant_obj = None
        if getattr(request, "user", None) and request.user.is_authenticated:
            tenant_obj, _err = ensure_tenant(request.user)
            # If tenant is missing, allow saving without tenant so data isn't lost.
            if _err:
                tenant_obj = None

        tags = request.data.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]

        # Merge any metadata provided by caller with context hints.
        metadata = request.data.get("metadata") or {}
        if not isinstance(metadata, dict):
            metadata = {}
        metadata.setdefault("user_agent", request.META.get("HTTP_USER_AGENT"))
        metadata.setdefault("referrer", request.META.get("HTTP_REFERER"))

        lead = Lead.objects.create(
            tenant=tenant_obj,
            name=request.data.get("name", "").strip(),
            email=email_val,
            phone=request.data.get("phone", "").strip(),
            company=request.data.get("company", "").strip(),
            website=request.data.get("website", "").strip(),
            service_interest=request.data.get("service_interest", "").strip(),
            budget=request.data.get("budget", "").strip(),
            message=request.data.get("message", "").strip(),
            source=request.data.get("source", "").strip() or request.data.get("utm_source", ""),
            status=request.data.get("status", "new").strip() or "new",
            tags=tags,
            metadata=metadata,
        )
        return Response(
            {
                "id": lead.id,
                "name": lead.name,
                "email": lead.email,
                "company": lead.company,
                "service_interest": lead.service_interest,
                "budget": lead.budget,
                "status": lead.status,
                "created_at": iso(lead.created_at),
            },
            status=201,
        )

    if not request.user or not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=401)

    tenant_ids = get_user_tenant_ids(request.user)
    leads_qs = Lead.objects.filter(Q(tenant_id__in=tenant_ids) | Q(tenant__isnull=True))
    data = [
        {
            "id": lead.id,
            "name": lead.name,
            "email": lead.email,
            "phone": lead.phone,
            "company": lead.company,
            "website": lead.website,
            "service_interest": lead.service_interest,
            "budget": lead.budget,
            "message": lead.message,
            "source": lead.source,
            "status": lead.status,
            "tags": lead.tags,
            "created_at": iso(lead.created_at),
        }
        for lead in leads_qs
    ]
    return Response(data)


# Email --------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_lists(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        name = request.data.get("name") or "New List"
        email_list = EmailList.objects.create(
            tenant=tenant,
            name=name,
            lawful_basis=request.data.get("lawful_basis", "consent"),
            region=request.data.get("region", ""),
        )
        return Response(
            {
                "id": email_list.id,
                "name": email_list.name,
                "subscriber_count": 0,
                "is_active": True,
                "open_rate": "0%",
                "created_at": iso(email_list.created_at),
                "description": f"Lawful basis: {email_list.lawful_basis}",
            },
            status=201,
        )

    lists = EmailList.objects.filter(tenant=tenant)
    data = [
        {
            "id": l.id,
            "name": l.name,
            "subscriber_count": l.contact_set.filter(subscribed=True).count(),
            "is_active": True,
            "open_rate": "0%",
            "created_at": iso(l.created_at),
            "description": f"Lawful basis: {l.lawful_basis}",
        }
        for l in lists
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_templates(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        name = request.data.get("name") or "New Template"
        subject = request.data.get("subject") or "Subject"
        body_html = request.data.get("body_html") or "<p>Welcome!</p>"
        template = EmailTemplate.objects.create(
            tenant=tenant,
            name=name,
            subject=subject,
            body_html=body_html,
            body_text=request.data.get("body_text", ""),
        )
        return Response(
            {
                "id": template.id,
                "name": template.name,
                "subject": template.subject,
                "is_active": True,
                "created_at": iso(template.created_at),
                "date_created": iso(template.created_at),
            },
            status=201,
        )

    templates = EmailTemplate.objects.filter(tenant=tenant)
    data = [
        {
            "id": t.id,
            "name": t.name,
            "subject": t.subject,
            "is_active": True,
            "created_at": iso(t.created_at),
            "date_created": iso(t.created_at),
        }
        for t in templates
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_flows(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        name = request.data.get("name") or "New Flow"
        flow = EmailFlow.objects.create(
            tenant=tenant,
            name=name,
            description=request.data.get("description", "Email automation flow"),
            enabled=True,
        )
        return Response(
            {
                "id": flow.id,
                "name": flow.name,
                "is_active": flow.enabled,
                "description": flow.description or "Email automation flow",
                "created_at": iso(flow.created_at),
            },
            status=201,
        )

    flows = EmailFlow.objects.filter(tenant=tenant)
    data = [
        {
            "id": f.id,
            "name": f.name,
            "is_active": f.enabled,
            "description": f.description or "Email automation flow",
            "created_at": iso(f.created_at),
        }
        for f in flows
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_contacts(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err
    if request.method == "POST":
        email_val = request.data.get("email") or ""
        contact = Contact.objects.create(
            tenant=tenant,
            email=email_val,
            name=request.data.get("name", ""),
            subscribed=True,
            properties=request.data.get("properties", {}),
        )
        return Response(
            {
                "id": contact.id,
                "email": contact.email,
                "name": contact.name,
                "subscribed": contact.subscribed,
                "subscribed_at": iso(contact.subscribed_at),
                "unsubscribed_at": iso(contact.unsubscribed_at),
            },
            status=201,
        )

    contacts = Contact.objects.filter(tenant=tenant)
    data = [
        {
            "id": c.id,
            "email": c.email,
            "name": c.name,
            "subscribed": c.subscribed,
            "subscribed_at": iso(c.subscribed_at),
            "unsubscribed_at": iso(c.unsubscribed_at),
        }
        for c in contacts
    ]
    return Response(data)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = (request.data.get("email") or "").strip()
    if not email:
        return Response({"error": "email required"}, status=400)
    try:
        user = get_user_model().objects.get(email=email)
    except Exception:
        return Response({"message": "If the account exists, a reset email has been sent."})

    token = get_random_string(48)
    expires_at = timezone.now() + timedelta(hours=1)
    PasswordResetToken.objects.create(user=user, token=token, expires_at=expires_at)

    reset_url = f"{request.build_absolute_uri('/').rstrip('/')}/api/auth/confirm-reset?token={token}"
    try:
        send_mail(
            "Password reset",
            f"Use this link to reset your password: {reset_url}",
            getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com"),
            [user.email],
            fail_silently=True,
        )
    except Exception:
        pass
    return Response({"message": "If the account exists, a reset email has been sent."})


@api_view(["POST"])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    token_val = request.data.get("token")
    new_password = request.data.get("password")
    if not token_val or not new_password:
        return Response({"error": "token and password required"}, status=400)
    try:
        token = PasswordResetToken.objects.get(token=token_val, used=False)
    except PasswordResetToken.DoesNotExist:
        return Response({"error": "Invalid token"}, status=400)
    if not token.is_valid():
        return Response({"error": "Token expired or used"}, status=400)
    user = token.user
    user.set_password(new_password)
    user.save()
    token.used = True
    token.save()
    return Response({"message": "Password updated"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def usage_summary(request):
    tenant_ids = get_user_tenant_ids(request.user)
    usage = {
        "email_sends": EmailSend.objects.filter(tenant_id__in=tenant_ids).count(),
        "sms_messages": SmsMessage.objects.filter(tenant_id__in=tenant_ids).count(),
        "leads": Lead.objects.filter(Q(tenant_id__in=tenant_ids) | Q(tenant__isnull=True)).count(),
        "social_posts": Post.objects.filter(tenant_id__in=tenant_ids).count(),
        "campaigns": EmailCampaign.objects.filter(tenant_id__in=tenant_ids).count(),
    }
    limits = {
        "email_sends": 10000,
        "sms_messages": 2000,
        "leads": 5000,
        "social_posts": 3000,
        "campaigns": 500,
    }
    return Response({"usage": usage, "limits": limits})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tasks_status(request):
    tenant_ids = get_user_tenant_ids(request.user)
    scheduled_posts = Post.objects.filter(tenant_id__in=tenant_ids, status="scheduled").count()
    scheduled_campaigns = EmailCampaign.objects.filter(tenant_id__in=tenant_ids, status="scheduled").count()
    return Response(
        {
            "scheduled_posts": scheduled_posts,
            "scheduled_campaigns": scheduled_campaigns,
        }
    )

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_sends(request):
    if request.method == "POST":
        tenant, err = ensure_tenant(request.user)
        if err:
            return err
        recipient_id = request.data.get("recipient_id")
        template_id = request.data.get("template_id")
        subject_override = request.data.get("subject")
        body_text_override = request.data.get("body_text")
        body_html_override = request.data.get("body_html")
        email_list_id = request.data.get("email_list_id")

        if not recipient_id:
            return Response({"error": "recipient_id is required"}, status=400)
        if not template_id and not (body_text_override or body_html_override or subject_override):
            return Response({"error": "template_id or subject/body required"}, status=400)

        recipient = get_object_or_404(Contact, id=recipient_id, tenant=tenant)
        template = None
        if template_id:
            template = get_object_or_404(EmailTemplate, id=template_id, tenant=tenant)
        email_list = None
        if email_list_id:
            email_list = get_object_or_404(EmailList, id=email_list_id, tenant=tenant)

        send = EmailSend.objects.create(
            tenant=tenant,
            recipient=recipient,
            template=template,
            email_list=email_list,
            status="queued",
        )

        ok, message_id, error = send_via_provider(
            send,
            subject_override=subject_override,
            body_text_override=body_text_override,
            body_html_override=body_html_override,
        )
        if ok:
            send.status = "sent"
            send.sent_at = timezone.now()
            send.message_id = message_id or ""
        else:
            send.status = "failed"
            send.last_error = error or "Unknown error"
        send.save()

        return Response(
            {
                "id": send.id,
                "status": send.status,
                "message_id": send.message_id,
                "sent_at": iso(send.sent_at),
                "error": send.last_error,
            },
            status=201 if ok else 500,
        )

    tenant_ids = get_user_tenant_ids(request.user)
    sends = EmailSend.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {
            "id": s.id,
            "recipient_email": s.recipient.email if s.recipient else "Unknown",
            "template_name": s.template.name if s.template else "N/A",
            "status": s.status,
            "sent_at": iso(s.sent_at),
            "message_id": s.message_id,
            "bounces": s.bounces,
            "complaints": s.complaints,
        }
        for s in sends
    ]
    return Response(data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def sms_messages(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    if request.method == "POST":
        to_number = (request.data.get("to_number") or "").strip()
        if not to_number:
            # Fallback to user's phone_number if provided
            to_number = getattr(request.user, "phone_number", "") or ""
        body = (request.data.get("body") or "").strip()
        contact_id = request.data.get("contact_id")
        if not to_number:
            return Response({"error": "to_number is required and no user phone_number is set"}, status=400)
        if not body:
            return Response({"error": "body is required"}, status=400)

        contact = None
        if contact_id:
            contact = get_object_or_404(Contact, id=contact_id, tenant=tenant)

        sms = SmsMessage.objects.create(
            tenant=tenant,
            contact=contact,
            to_number=to_number,
            body=body,
            status="queued",
            metadata={"source": request.data.get("source") or "manual"},
        )

        ok, message_id, error = send_sms_via_provider(sms)
        if ok:
            sms.status = "sent"
            sms.sent_at = timezone.now()
            sms.provider_message_id = message_id or ""
        else:
            sms.status = "failed"
            sms.last_error = error or "Unknown error"
        sms.save()

        return Response(
            {
                "id": sms.id,
                "status": sms.status,
                "provider_message_id": sms.provider_message_id,
                "sent_at": iso(sms.sent_at),
                "error": sms.last_error,
            },
            status=201 if ok else 500,
        )

    sms_qs = SmsMessage.objects.filter(tenant=tenant)
    data = [
        {
            "id": sms.id,
            "to_number": sms.to_number,
            "body": sms.body[:140] + "..." if len(sms.body) > 140 else sms.body,
            "status": sms.status,
            "sent_at": iso(sms.sent_at),
            "provider_message_id": sms.provider_message_id,
            "error": sms.last_error,
        }
        for sms in sms_qs
    ]
    return Response(data)


def _send_campaign_now(campaign, tenant):
    contacts = Contact.objects.filter(tenant=tenant, subscribed=True)
    sent = 0
    errors = []
    for contact in contacts:
        send = EmailSend.objects.create(
            tenant=tenant,
            recipient=contact,
            template=campaign.template,
            email_list=campaign.email_list,
            status="queued",
        )
        ok, message_id, error = send_via_provider(
            send,
            subject_override=campaign.subject_override or None,
            body_text_override=campaign.body_text_override or None,
            body_html_override=campaign.body_html_override or None,
        )
        if ok:
            send.status = "sent"
            send.sent_at = timezone.now()
            send.message_id = message_id or ""
            sent += 1
        else:
            send.status = "failed"
            send.last_error = error or "Unknown error"
            errors.append(error)
        send.save()
    campaign.sent_count = sent
    campaign.sent_at = timezone.now()
    campaign.status = "sent" if sent else "failed"
    campaign.last_error = "; ".join([e for e in errors if e])[:500]
    campaign.save()


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def email_campaigns(request):
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    if request.method == "POST":
        email_list_id = request.data.get("email_list_id")
        template_id = request.data.get("template_id")
        subject = request.data.get("subject") or ""
        body_text = request.data.get("body_text") or ""
        body_html = request.data.get("body_html") or ""
        send_now = str(request.data.get("send_now", "")).lower() in ("1", "true", "yes")
        scheduled_for = request.data.get("scheduled_for")

        email_list = get_object_or_404(EmailList, id=email_list_id, tenant=tenant) if email_list_id else None
        template = get_object_or_404(EmailTemplate, id=template_id, tenant=tenant) if template_id else None

        if not template and not subject and not body_text and not body_html:
            return Response({"error": "template or subject/body required"}, status=400)

        campaign = EmailCampaign.objects.create(
            tenant=tenant,
            email_list=email_list,
            template=template,
            subject_override=subject,
            body_text_override=body_text,
            body_html_override=body_html,
            status="scheduled" if scheduled_for else ("draft" if not send_now else "scheduled"),
            scheduled_for=scheduled_for,
        )

        if send_now or (scheduled_for and scheduled_for <= timezone.now()):
            _send_campaign_now(campaign, tenant)

        return Response(
            {
                "id": campaign.id,
                "status": campaign.status,
                "sent_count": campaign.sent_count,
                "scheduled_for": iso(campaign.scheduled_for),
                "sent_at": iso(campaign.sent_at),
            },
            status=201,
        )

    campaigns = EmailCampaign.objects.filter(tenant=tenant)
    data = [
        {
            "id": c.id,
            "status": c.status,
            "sent_count": c.sent_count,
            "scheduled_for": iso(c.scheduled_for),
            "sent_at": iso(c.sent_at),
            "created_at": iso(c.created_at),
        }
        for c in campaigns
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_marketing_summary(request):
    """Aggregate overview for email marketing."""
    tenant_ids = get_user_tenant_ids(request.user)
    lists_count = EmailList.objects.filter(tenant_id__in=tenant_ids).count()
    contacts_count = Contact.objects.filter(tenant_id__in=tenant_ids).count()
    templates_count = EmailTemplate.objects.filter(tenant_id__in=tenant_ids).count()
    flows_count = EmailFlow.objects.filter(tenant_id__in=tenant_ids).count()
    sends_count = EmailSend.objects.filter(tenant_id__in=tenant_ids).count()

    return Response(
        {
            "lists_count": lists_count,
            "contacts_count": contacts_count,
            "templates_count": templates_count,
            "flows_count": flows_count,
            "sends_count": sends_count,
        }
    )


# Translation / LLM (stubbed) ----------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def translate_text(request):
    """
    Stub translation endpoint. Accepts `text` and optional `target_lang`.
    If `url` is provided, we respond with an error because external fetch is disabled.
    """
    text = request.data.get("text", "")
    url = request.data.get("url")
    target_lang = request.data.get("target_lang", "en")
    fetched_from = None

    # Optional: fetch content from URL if provided
    if url and not text:
        try:
            import requests

            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            text = resp.text[:5000]  # basic limit to avoid huge payloads
            fetched_from = url
        except Exception as exc:
            return Response({"error": f"Failed to fetch URL: {exc}"}, status=400)

    if not text:
        return Response({"error": "text is required"}, status=400)

    # Try OpenAI if configured; otherwise stub
    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if api_key:
        try:
            import openai

            openai.api_key = api_key
            prompt_text = text[:3500]  # keep prompt reasonable
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                temperature=0.2,
                messages=[
                    {"role": "system", "content": f"You are a translation engine. Translate to {target_lang} preserving meaning and tone."},
                    {"role": "user", "content": prompt_text},
                ],
            )
            translated = completion["choices"][0]["message"]["content"].strip()
            return Response(
                {
                    "source": "openai",
                    "original": text,
                    "translated": translated,
                    "target_lang": target_lang,
                    "fetched_from": fetched_from,
                }
            )
        except Exception as exc:
            # Fallback to stub if OpenAI fails
            fallback = f"[{target_lang}] {text}"
            return Response(
                {
                    "source": "stub",
                    "original": text,
                    "translated": fallback,
                    "target_lang": target_lang,
                    "fetched_from": fetched_from,
                    "error": str(exc),
                },
                status=200,
            )

    # No API key: stub translation
    translated = f"[{target_lang}] {text}"
    return Response(
        {"source": "stub", "original": text, "translated": translated, "target_lang": target_lang, "fetched_from": fetched_from}
    )


# Geo ----------------------------------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def geo_lookup(request):
    """
    Geocode an address. Uses OpenAI if configured, otherwise returns a stub.
    Accepts: address (string), optional city/state/country for hints.
    """
    address = request.data.get("address", "")
    city = request.data.get("city")
    state = request.data.get("state")
    country = request.data.get("country")

    if not address:
        return Response({"error": "address is required"}, status=400)

    full = ", ".join([x for x in [address, city, state, country] if x])

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if api_key:
        try:
            import openai

            openai.api_key = api_key
            prompt = (
                "You are a geocoding assistant. Given an address, return a JSON object with "
                "'lat' and 'lng' numeric fields. If uncertain, approximate.\n"
                f"Address: {full}"
            )
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                temperature=0,
                messages=[
                    {"role": "system", "content": "Return only JSON with lat and lng keys."},
                    {"role": "user", "content": prompt},
                ],
            )
            content = completion["choices"][0]["message"]["content"].strip()
            # Best effort parse
            import json

            coords = json.loads(content)
            lat = coords.get("lat")
            lng = coords.get("lng")
            if lat is None or lng is None:
                raise ValueError("lat/lng not found")
            return Response({"source": "openai", "lat": lat, "lng": lng, "query": full})
        except Exception as exc:
            # Fall back to stub
            pass

    # Stubbed coords (0,0) when no API or failure
    return Response({"source": "stub", "lat": 0.0, "lng": 0.0, "query": full})


# AEO ----------------------------------------------------------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def aeo_readiness(request):
    """
    AEO readiness check with optional OpenAI analysis and persistent checklist.
    Accepts: domain, vertical, primary_keywords (list), locales (list), faq_urls (list), regenerate (bool).
    """
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    payload = request.data if request.method == "POST" else request.query_params
    domain = payload.get("domain", "")
    vertical = payload.get("vertical", "")
    keywords = payload.get("primary_keywords", [])
    if isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(",") if k.strip()]
    locales = payload.get("locales", [])
    if isinstance(locales, str):
        locales = [l.strip() for l in locales.split(",") if l.strip()]
    faq_urls = payload.get("faq_urls", [])
    if isinstance(faq_urls, str):
        faq_urls = [u.strip() for u in faq_urls.split(",") if u.strip()]
    regenerate = str(payload.get("regenerate", "")).lower() in ("1", "true", "yes")

    # If we already have stored checklist and no regenerate requested, return it.
    existing = AeoChecklistItem.objects.filter(tenant=tenant).order_by("-updated_at")
    if existing.exists() and not regenerate:
        data = [
            {
                "id": item.id,
                "name": item.name,
                "status": item.status,
                "recommendation": item.recommendation,
                "updated_at": iso(item.updated_at),
            }
            for item in existing
        ]
        return Response({"status": "ok", "source": "stored", "checks": data})

    nav_context = dedent(
        """
        App navigation:
        - Home (/)
        - Pricing (/pricing)
        - Optimisation (/optimisation) [SEO/Technical]
        - Reach (/reach) [Social/Community]
        - Growth (/growth) [Email/SMS]
        - Dashboard (/dashboard)
        - Data entry (/data-entry, /seo/data, /aeo/data)
        - Leads (/leads)
        """
    )

    checks = []
    quick_actions = [
        {"action": "Add FAQs in /aeo/data", "cta": "/#/aeo/data"},
        {"action": "Seed keywords in /seo/data", "cta": "/#/seo/data"},
        {"action": "Capture leads in /leads", "cta": "/#/leads"},
    ]
    source_label = "stub"

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if api_key:
        try:
            import openai
            import json

            openai.api_key = api_key
            prompt = dedent(
                f"""
                You are an AEO (answer-engine optimization) readiness auditor.
                Assess the site's readiness given:
                - domain: {domain or 'unknown'}
                - vertical: {vertical or 'general'}
                - primary keywords: {keywords or 'none supplied'}
                - locales: {locales or 'en'}
                - faq URLs: {faq_urls or 'none'}
                - app navigation routes: {nav_context}

                Return a concise JSON with:
                - checks: array of objects with name, status (good|warning|poor), and recommendation.
                - quick_actions: array of actions with cta paths in this app.
                """
            )
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                temperature=0.3,
                messages=[
                    {"role": "system", "content": "Return valid JSON only. Keep it concise."},
                    {"role": "user", "content": prompt},
                ],
            )
            parsed = json.loads(completion["choices"][0]["message"]["content"])
            checks = parsed.get("checks", [])
            quick_actions = parsed.get("quick_actions", quick_actions)
            source_label = "openai"
        except Exception:
            checks = []

    if not checks:
        checks = [
            {"name": "Structured FAQs", "status": "warning", "recommendation": "Add FAQ schema to top questions."},
            {"name": "Multilingual coverage", "status": "warning", "recommendation": "Localize priority pages and add hreflang."},
            {"name": "Backlinks", "status": "warning", "recommendation": "Add 5+ authoritative backlinks to key URLs."},
            {"name": "Answer coverage", "status": "poor", "recommendation": "Create concise Q&A for top keywords."},
        ]

    # Replace stored checklist with new results
    AeoChecklistItem.objects.filter(tenant=tenant).delete()
    valid_statuses = {choice[0] for choice in AeoChecklistItem.STATUS_CHOICES}
    stored_items = []
    for item in checks:
        status_val = item.get("status", "pending")
        if status_val not in valid_statuses:
            status_val = "pending"
        obj = AeoChecklistItem.objects.create(
            tenant=tenant,
            name=item.get("name", "Check"),
            status=status_val,
            recommendation=item.get("recommendation", ""),
            source=source_label,
            metadata=item,
        )
        stored_items.append(obj)

    data = [
        {
            "id": item.id,
            "name": item.name,
            "status": item.status,
            "recommendation": item.recommendation,
            "updated_at": iso(item.updated_at),
        }
        for item in stored_items
    ]
    return Response({"status": "ok", "source": source_label, "checks": data, "quick_actions": quick_actions})


# Free Zone ---------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def free_zone(request):
    """
    Free Zone ideation powered by OpenAI (if configured) with persistence.
    Accepts optional: goal, audience, vertical, regenerate (bool).
    """
    tenant, err = ensure_tenant(request.user)
    if err:
        return err

    payload = request.data if request.method == "POST" else request.query_params
    goal = payload.get("goal", "organic growth")
    audience = payload.get("audience", "SMBs")
    vertical = payload.get("vertical", "general")
    regenerate = str(payload.get("regenerate", "")).lower() in ("1", "true", "yes")

    existing = FreeZoneIdea.objects.filter(tenant=tenant).order_by("-updated_at")
    if existing.exists() and not regenerate:
        return Response(
            {
                "source": "stored",
                "ideas": [
                    {
                        "id": idea.id,
                        "title": idea.title,
                        "type": idea.idea_type,
                        "description": idea.description,
                        "cta": idea.cta,
                        "effort": idea.effort,
                        "status": idea.status,
                    }
                    for idea in existing
                ],
            }
        )

    nav_context = dedent(
        """
        App navigation:
        - Home (/)
        - Pricing (/pricing)
        - Optimisation (/optimisation)
        - Reach (/reach)
        - Growth (/growth)
        - Dashboard (/dashboard)
        - Data entry (/data-entry, /seo/data, /aeo/data)
        - Leads (/leads)
        """
    )

    ideas = []
    landing_route = "/"
    source_label = "stub"

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if api_key:
        try:
            import openai, json

            openai.api_key = api_key
            prompt = dedent(
                f"""
                Generate Free Zone ideas (microtools, campaigns, content) for:
                goal: {goal}
                audience: {audience}
                vertical: {vertical}
                app navigation: {nav_context}
                Return JSON with:
                - landing_route: one of the routes above
                - ideas: array of items with title, type (microtool|campaign|content), description, cta (route), effort (low|medium|high)
                """
            )
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                temperature=0.6,
                messages=[
                    {"role": "system", "content": "Return valid JSON only. Keep items concise."},
                    {"role": "user", "content": prompt},
                ],
            )
            parsed = json.loads(completion["choices"][0]["message"]["content"])
            ideas = parsed.get("ideas", [])
            landing_route = parsed.get("landing_route", "/")
            source_label = "openai"
        except Exception:
            ideas = []

    if not ideas:
        ideas = [
            {"title": "SEO mini-audit", "type": "microtool", "description": "Quickly score on-page SEO for top URLs.", "cta": "/#/seo/data", "effort": "low"},
            {"title": "Headline tester", "type": "microtool", "description": "Test headline variants for CTR uplift.", "cta": "/#/aeo/data", "effort": "low"},
            {"title": "Lead magnet promo", "type": "campaign", "description": "Collect emails with a targeted guide.", "cta": "/#/leads", "effort": "medium"},
        ]

    FreeZoneIdea.objects.filter(tenant=tenant).delete()
    valid_types = {c[0] for c in FreeZoneIdea.IDEA_CHOICES}
    valid_effort = {c[0] for c in FreeZoneIdea.EFFORT_CHOICES}
    stored = []
    for idea in ideas:
        idea_type = idea.get("type", "microtool")
        if idea_type not in valid_types:
            idea_type = "microtool"
        effort_val = idea.get("effort", "medium")
        if effort_val not in valid_effort:
            effort_val = "medium"
        obj = FreeZoneIdea.objects.create(
            tenant=tenant,
            title=idea.get("title", "Idea"),
            idea_type=idea_type,
            description=idea.get("description", ""),
            cta=idea.get("cta", ""),
            effort=effort_val,
            status="open",
            metadata=idea,
        )
        stored.append(obj)

    return Response(
        {
            "source": source_label,
            "landing_route": landing_route,
            "ideas": [
                {
                    "id": idea.id,
                    "title": idea.title,
                    "type": idea.idea_type,
                    "description": idea.description,
                    "cta": idea.cta,
                    "effort": idea.effort,
                    "status": idea.status,
                }
                for idea in stored
            ],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_report(request):
    """Generate a lightweight PDF summary of key metrics for the dashboard."""
    tenant_ids = get_user_tenant_ids(request.user)

    range_param = request.query_params.get("range", "30d")
    start_param = request.query_params.get("start_date")
    end_param = request.query_params.get("end_date")
    now = timezone.now()
    start_date = None
    end_date = now

    if range_param == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_param == "7d":
        start_date = now - timedelta(days=7)
    elif range_param == "30d":
        start_date = now - timedelta(days=30)
    elif range_param == "90d":
        start_date = now - timedelta(days=90)
    elif range_param == "custom":
        try:
            if start_param:
                start_date = timezone.datetime.fromisoformat(start_param)
                if timezone.is_naive(start_date):
                    start_date = timezone.make_aware(start_date)
            if end_param:
                end_date = timezone.datetime.fromisoformat(end_param)
                if timezone.is_naive(end_date):
                    end_date = timezone.make_aware(end_date)
        except Exception:
            pass

    def safe_count(qs, field_name):
        try:
            if start_date:
                qs = qs.filter(**{f"{field_name}__gte": start_date})
            if end_date:
                qs = qs.filter(**{f"{field_name}__lte": end_date})
            return qs.count()
        except Exception:
            return qs.count()

    # Collect basic counts
    aso_count = safe_count(ASOApp.objects.filter(tenant_id__in=tenant_ids), "created_at")
    marketplace_count = safe_count(Product.objects.filter(tenant_id__in=tenant_ids), "created_at")
    seo_sites_count = safe_count(SEOSite.objects.filter(tenant_id__in=tenant_ids), "created_at")
    backlink_count = safe_count(Backlink.objects.filter(site__tenant_id__in=tenant_ids), "first_seen")
    leads_count = safe_count(Lead.objects.filter(Q(tenant_id__in=tenant_ids) | Q(tenant__isnull=True)), "created_at")
    emails_count = safe_count(Contact.objects.filter(tenant_id__in=tenant_ids), "subscribed_at")
    sms_count = safe_count(SmsMessage.objects.filter(tenant_id__in=tenant_ids), "created_at")
    repurpose_jobs = safe_count(RepurposeJob.objects.filter(tenant_id__in=tenant_ids), "created_at")
    aeo_checks = safe_count(AeoChecklistItem.objects.filter(tenant_id__in=tenant_ids), "updated_at")
    free_zone_ideas = safe_count(FreeZoneIdea.objects.filter(tenant_id__in=tenant_ids), "updated_at")

    buffer = BytesIO()
    img = Image.new("RGB", (1200, 1600), color="white")
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    line_height = font.getbbox("Ag")[3] + 6

    lines = [
        "Icycon Dashboard Report",
        f"User: {request.user.email}",
        "",
        "Key Metrics:",
        f"- ASO Apps: {aso_count}",
        f"- Marketplace Products: {marketplace_count}",
        f"- SEO Sites: {seo_sites_count}",
        f"- Backlinks: {backlink_count}",
        f"- Leads: {leads_count}",
        f"- Email Contacts: {emails_count}",
        f"- SMS Messages: {sms_count}",
        f"- Repurpose Jobs: {repurpose_jobs}",
        f"- AEO Checklist Items: {aeo_checks}",
        f"- Free Zone Ideas: {free_zone_ideas}",
    ]

    x, y = 60, 60
    for line in lines:
        draw.text((x, y), line, fill="black", font=font)
        y += line_height

    img.save(buffer, format="PDF")
    pdf_bytes = buffer.getvalue()
    buffer.close()

    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="dashboard-report.pdf"'
    return response
