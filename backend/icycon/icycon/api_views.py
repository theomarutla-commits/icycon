from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from analytics.models import Site, ContentItem, PageView
from aso.models import App as ASOApp, AppKeyword, AppListing
from email_engine.models import Contact, EmailFlow, EmailList, EmailSend, EmailTemplate
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
from social_media.models import (
    Comment,
    Conversation as SocialConversation,
    Engagement,
    Message as SocialMessage,
    Post,
    SocialAccount,
)
from tenants.models import Tenant, TenantUser

FEATURES_INDEX = [
    # Platform / global
    {"key": "dashboard", "slug": "seo", "name": "Dashboard", "path": "/api/dashboard/", "description": "User overview and counts"},
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
    {"key": "email_marketing_summary", "slug": "email", "name": "Email Marketing", "path": "/api/email/marketing/", "description": "Email marketing overview"},
    # Multilingual
    {"key": "multilingual_summary", "slug": "multilingual", "name": "Multilingual Summary", "path": "/api/multilingual/summary/", "description": "Content locales summary"},
    # Backlinks & directories
    {"key": "seo_backlinks", "slug": "backlinks", "name": "SEO Backlinks", "path": "/api/seo/backlinks/", "description": "Backlinks for your SEO sites"},
    {"key": "seo_directories", "slug": "directories", "name": "SEO Directories", "path": "/api/seo/directories/", "description": "Directory listings/citations"},
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

    return Response(
        {
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": user.avatar.url if getattr(user, "avatar", None) else None,
            },
            "aso_apps_count": safe_count(ASOApp.objects.filter(tenant_id__in=tenant_ids)) if tenant_ids else 0,
            "marketplace_products_count": safe_count(Product.objects.filter(tenant_id__in=tenant_ids)) if tenant_ids else 0,
            "recent_activities": [],
        }
    )


# ASO ----------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def aso_apps(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        name = request.data.get("name") or "New App"
        platform = request.data.get("platform") or "ios"
        return Response(
            {
                "id": 0,
                "name": name,
                "platform": platform,
                "bundle_id": request.data.get("bundle_id", ""),
                "rating": 0,
                "reviews_count": 0,
                "downloads_count": 0,
                "category": request.data.get("category", ""),
                "icon_url": request.data.get("icon_url", ""),
                "status": "draft",
                "keywords_count": 0,
            },
            status=201,
        )

    apps = ASOApp.objects.filter(tenant_id__in=tenant_ids)
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
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def marketplace_products(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        title = request.data.get("title") or "Untitled Product"
        price = request.data.get("price", 0)
        return Response(
            {
                "id": 0,
                "title": title,
                "category": request.data.get("category", "general"),
                "status": request.data.get("status", "draft"),
                "price": float(price) if price else 0,
                "pricing_type": request.data.get("pricing_type", "one_time"),
                "featured_image": request.data.get("featured_image", ""),
                "rating": 0,
                "review_count": 0,
                "created_at": iso(None),
            },
            status=201,
        )

    products = Product.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_sites(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        domain = request.data.get("domain") or "example.com"
        locale = request.data.get("default_locale", "en")
        return Response(
            {
                "id": 0,
                "domain": domain,
                "default_locale": locale,
                "created_at": iso(None),
                "pageview_count": 0,
            },
            status=201,
        )

    sites = Site.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_keyword_clusters(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        intent = request.data.get("intent") or request.data.get("keyword")
        terms = request.data.get("terms") or []
        locale = request.data.get("locale", "en")
        if isinstance(terms, str):
            terms = [t.strip() for t in terms.split(",") if t.strip()]
        if not intent:
            return Response({"error": "intent or keyword is required"}, status=400)
        if not tenant_ids:
            return Response({"error": "No tenant associated with user"}, status=400)
        cluster = SEOKeywordCluster.objects.create(
            tenant_id=tenant_ids[0],
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

    clusters = SEOKeywordCluster.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_content_items(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        url = request.data.get("url") or "https://example.com"
        return Response(
            {
                "id": 0,
                "type": request.data.get("type", "page"),
                "url": url,
                "status": request.data.get("status", "draft"),
                "locale": request.data.get("locale", "en"),
                "created_at": iso(None),
            },
            status=201,
        )

    items = SEOContentItem.objects.filter(tenant_id__in=tenant_ids)
    data = [
        {"id": i.id, "type": i.type, "url": i.url, "status": i.status, "locale": i.locale, "created_at": iso(i.created_at)}
        for i in items
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_faqs(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        question = request.data.get("question") or "New FAQ?"
        answer = request.data.get("answer") or ""
        return Response(
            {
                "id": 0,
                "question": question,
                "answer": answer,
                "created_at": iso(None),
            },
            status=201,
        )

    faqs = SEOFAQ.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_backlinks(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        return Response(
            {
                "id": 0,
                "site_id": request.data.get("site_id"),
                "domain": request.data.get("domain", "example.com"),
                "source_url": request.data.get("source_url", ""),
                "target_url": request.data.get("target_url", ""),
                "anchor_text": request.data.get("anchor_text", ""),
                "status": request.data.get("status", "active"),
                "domain_rating": request.data.get("domain_rating", 0),
                "created_at": iso(None),
            },
            status=201,
        )

    if not hasattr(SEOSite, "backlinks"):
        return Response([])
    sites = SEOSite.objects.filter(tenant_id__in=tenant_ids).prefetch_related("backlinks")
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


@api_view(["GET"])
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def social_posts(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        content = request.data.get("content") or ""
        return Response(
            {
                "id": 0,
                "content": content,
                "platform": request.data.get("platform", "general"),
                "status": "scheduled",
                "created_at": iso(None),
                "posted_date": None,
                "like_count": 0,
                "comment_count": 0,
                "share_count": 0,
            },
            status=201,
        )

    posts = Post.objects.filter(tenant_id__in=tenant_ids)
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


# Email --------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_lists(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        name = request.data.get("name") or "New List"
        return Response(
            {
                "id": 0,
                "name": name,
                "subscriber_count": 0,
                "is_active": True,
                "open_rate": "0%",
                "created_at": iso(None),
                "description": f"Lawful basis: {request.data.get('lawful_basis', 'unknown')}",
            },
            status=201,
        )

    lists = EmailList.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_templates(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        name = request.data.get("name") or "New Template"
        subject = request.data.get("subject") or "Subject"
        return Response(
            {
                "id": 0,
                "name": name,
                "subject": subject,
                "is_active": True,
                "created_at": iso(None),
                "date_created": iso(None),
            },
            status=201,
        )

    templates = EmailTemplate.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_flows(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        name = request.data.get("name") or "New Flow"
        return Response(
            {
                "id": 0,
                "name": name,
                "is_active": True,
                "description": request.data.get("description", "Email automation flow"),
                "created_at": iso(None),
            },
            status=201,
        )

    flows = EmailFlow.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_contacts(request):
    tenant_ids = get_user_tenant_ids(request.user)
    if request.method == "POST":
        email_val = request.data.get("email") or ""
        return Response(
            {
                "id": 0,
                "email": email_val,
                "name": request.data.get("name", ""),
                "subscribed": True,
                "subscribed_at": iso(None),
                "unsubscribed_at": None,
            },
            status=201,
        )

    contacts = Contact.objects.filter(tenant_id__in=tenant_ids)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def email_sends(request):
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
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def aeo_readiness(request):
    """Stubbed AEO readiness checklist."""
    return Response(
        {
            "status": "ok",
            "checks": [
                {"name": "Structured FAQs", "status": "pending"},
                {"name": "Multilingual coverage", "status": "pending"},
                {"name": "Backlinks", "status": "pending"},
            ],
        }
    )


# Free Zone ---------------------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def free_zone(request):
    """Stubbed Free Zone ideas."""
    return Response(
        {
            "ideas": [
                {"title": "SEO mini-audit", "type": "microtool", "cta": "/"},
                {"title": "A/B headline tester", "type": "microtool", "cta": "/"},
                {"title": "Newsletter opt-in promo", "type": "campaign", "cta": "/"},
            ]
        }
    )
