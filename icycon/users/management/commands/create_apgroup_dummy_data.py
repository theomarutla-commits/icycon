from django.core.management.base import BaseCommand
from django.utils import timezone
from django.apps import apps
import uuid
from datetime import timedelta


class Command(BaseCommand):
    help = "Create dummy data for git@apgroup.app across all major features."

    def add_arguments(self, parser):
        parser.add_argument("--email", default="git@apgroup.app", help="Target user email")
        parser.add_argument("--password", default="Motheo_22", help="Password to set if user is created")
        parser.add_argument("--tenant", default="APGroup Tenant", help="Tenant name to create/use")

    def handle(self, *args, **opts):
        from django.contrib.auth import get_user_model  # ensure settings are loaded
        from django.db import IntegrityError

        User = get_user_model()

        email = opts["email"]
        password = opts["password"]
        tenant_name = opts["tenant"]
        username = email.split("@")[0]

        # Resolve models via app registry to avoid import issues
        Tenant = apps.get_model("tenants", "Tenant")
        TenantUser = apps.get_model("tenants", "TenantUser")
        ASOApp = apps.get_model("aso", "App")
        AppKeyword = apps.get_model("aso", "AppKeyword")
        AppListing = apps.get_model("aso", "AppListing")
        Product = apps.get_model("marketplace", "Product")
        Order = apps.get_model("marketplace", "Order")
        Review = apps.get_model("marketplace", "Review")
        SavedProduct = apps.get_model("marketplace", "SavedProduct")
        Conversation = apps.get_model("marketplace", "Conversation")
        Message = apps.get_model("marketplace", "Message")
        AnalyticsSite = apps.get_model("analytics", "Site")
        PageView = apps.get_model("analytics", "PageView")
        SEOSite = apps.get_model("seo", "Site")
        SEOContentItem = apps.get_model("seo", "ContentItem")
        SEOFAQ = apps.get_model("seo", "FAQ")
        SEOKeywordCluster = apps.get_model("seo", "KeywordCluster")
        SocialAccount = apps.get_model("social_media", "SocialAccount")
        Post = apps.get_model("social_media", "Post")
        Comment = apps.get_model("social_media", "Comment")
        Engagement = apps.get_model("social_media", "Engagement")
        EmailList = apps.get_model("email_engine", "EmailList")
        Contact = apps.get_model("email_engine", "Contact")
        EmailTemplate = apps.get_model("email_engine", "EmailTemplate")
        EmailFlow = apps.get_model("email_engine", "EmailFlow")
        EmailSend = apps.get_model("email_engine", "EmailSend")

        def safe(desc, fn):
            try:
                return fn()
            except IntegrityError as exc:
                self.stdout.write(self.style.WARNING(f"{desc} skipped (integrity): {exc}"))
            except Exception as exc:
                self.stdout.write(self.style.WARNING(f"{desc} skipped (error): {exc}"))
            return None

        # User and tenant
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username, "first_name": "AP", "last_name": "Group"},
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user {email}"))
        tenant, _ = Tenant.objects.get_or_create(name=tenant_name, defaults={"region": "US", "plan": "free"})
        TenantUser.objects.get_or_create(user=user, tenant=tenant, defaults={"role": "owner"})

        # ASO
        aso_app = safe(
            "ASO app",
            lambda: ASOApp.objects.get_or_create(
                tenant=tenant,
                bundle_id="com.apgroup.demo",
                defaults={
                    "name": "APGroup Demo App",
                    "platform": "android",
                    "developer_name": "APGroup",
                    "description": "Demo app for ASO data.",
                    "status": "active",
                    "category": "Productivity",
                    "rating": 4.5,
                    "reviews_count": 120,
                    "downloads_count": 50000,
                },
            )[0],
        )
        if aso_app:
            safe("ASO keyword", lambda: AppKeyword.objects.get_or_create(app=aso_app, keyword="apgroup", defaults={"position": 5, "search_volume": 1200}))
            safe(
                "ASO listing",
                lambda: AppListing.objects.get_or_create(
                    app=aso_app,
                    locale="en_US",
                    defaults={
                        "title": "APGroup Demo App",
                        "subtitle": "All-in-one toolkit",
                        "description": "Demo listing for APGroup app.",
                        "keywords_string": "demo,apgroup,productivity",
                        "promotional_text": "Try the demo today",
                        "version": "1.0.0",
                    },
                )[0],
            )

        # Marketplace
        product = safe(
            "marketplace product",
            lambda: Product.objects.get_or_create(
                tenant=tenant,
                created_by=user,
                title="APGroup Analytics Suite",
                defaults={
                    "description": "Demo product for marketplace.",
                    "category": "analytics",
                    "status": "published",
                    "pricing_type": "fixed",
                    "price": 49.99,
                    "features": ["Dashboards", "API access", "Exports"],
                    "tags": ["demo", "apgroup"],
                    "published_at": timezone.now(),
                },
            )[0],
        )
        if product:
            safe("saved product", lambda: SavedProduct.objects.get_or_create(user=user, product=product))
            safe(
                "order",
                lambda: Order.objects.get_or_create(
                    order_number=f"ORD-{uuid.uuid4().hex[:10].upper()}",
                    product=product,
                    buyer_tenant=tenant,
                    buyer_user=user,
                    defaults={
                        "quantity": 1,
                        "unit_price": product.price or 0,
                        "total_price": product.price or 0,
                        "status": "completed",
                        "customer_email": email,
                        "payment_status": "completed",
                        "access_token": uuid.uuid4().hex,
                    },
                )[0],
            )
            safe(
                "review",
                lambda: Review.objects.get_or_create(
                    product=product,
                    reviewer=user,
                    tenant=tenant,
                    defaults={"rating": 5, "title": "Great tool", "comment": "Loving the APGroup demo product."},
                )[0],
            )
            conv = safe(
                "conversation",
                lambda: Conversation.objects.get_or_create(
                    product=product, buyer_tenant=tenant, seller_tenant=tenant, defaults={"subject": "Demo conversation"}
                )[0],
            )
            if conv:
                safe("conversation message", lambda: Message.objects.get_or_create(conversation=conv, sender=user, defaults={"content": "Is support included?"})[0])

        # Analytics
        analytics_site = safe(
            "analytics site",
            lambda: AnalyticsSite.objects.get_or_create(
                tenant=tenant, domain="https://apgroup.app", defaults={"sitemaps_url": "https://apgroup.app/sitemap.xml"}
            )[0],
        )
        if analytics_site:
            safe(
                "pageview",
                lambda: PageView.objects.get_or_create(
                    site=analytics_site,
                    url="https://apgroup.app/",
                    visitor_id="visitor-1",
                    defaults={"duration": 120, "bounce": False, "referrer": "https://google.com"},
                )[0],
            )

        # SEO
        seo_site = safe(
            "seo site",
            lambda: SEOSite.objects.get_or_create(
                tenant=tenant, domain="https://apgroup.app", defaults={"sitemaps_url": "https://apgroup.app/sitemap.xml"}
            )[0],
        )
        if seo_site:
            safe(
                "seo content",
                lambda: SEOContentItem.objects.get_or_create(
                    tenant=tenant,
                    type="blog",
                    url="https://apgroup.app/blog/demo-post",
                    defaults={"status": "published", "locale": "en", "brief_json": {"title": "Demo Post"}},
                )[0],
            )
            safe(
                "seo faq",
                lambda: SEOFAQ.objects.get_or_create(
                    tenant=tenant,
                    question="What is APGroup?",
                    defaults={"answer": "APGroup demo answer", "source_urls": ["https://apgroup.app"]},
                )[0],
            )
            safe(
                "seo keyword cluster",
                lambda: SEOKeywordCluster.objects.get_or_create(
                    tenant=tenant,
                    intent="demo",
                    defaults={"locale": "en", "terms": ["apgroup", "demo", "productivity suite"]},
                )[0],
            )

        # Social
        safe(
            "social account",
            lambda: SocialAccount.objects.get_or_create(
                tenant=tenant, platform="linkedin", handle="apgroup", defaults={"oauth_tokens": {}}
            )[0],
        )
        post = safe(
            "social post",
            lambda: Post.objects.get_or_create(
                tenant=tenant,
                author=user,
                title="APGroup Demo Launch",
                defaults={
                    "content": "Announcing the APGroup demo launch.",
                    "excerpt": "Demo launch",
                    "status": "published",
                    "platforms": ["linkedin"],
                    "tags": ["demo"],
                },
            )[0],
        )
        if post:
            safe("social comment", lambda: Comment.objects.get_or_create(post=post, author=user, defaults={"content": "Excited to try this!"})[0])
            safe(
                "social engagement",
                lambda: Engagement.objects.get_or_create(
                    post=post,
                    platform="linkedin",
                    defaults={"likes": 10, "shares": 2, "comments": 1, "clicks": 15, "impressions": 200, "reach": 180},
                )[0],
            )

        # Email
        email_list = safe(
            "email list",
            lambda: EmailList.objects.get_or_create(
                tenant=tenant, name="APGroup Demo List", defaults={"lawful_basis": "consent", "region": "US"}
            )[0],
        )
        contact = safe("contact", lambda: Contact.objects.get_or_create(tenant=tenant, email=email, defaults={"name": "APGroup Contact"})[0])
        template = safe(
            "email template",
            lambda: EmailTemplate.objects.get_or_create(
                tenant=tenant,
                name="Welcome",
                defaults={"subject": "Welcome to APGroup", "body_html": "<p>Welcome!</p>", "body_text": "Welcome!"},
            )[0],
        )
        safe(
            "email flow",
            lambda: EmailFlow.objects.get_or_create(
                tenant=tenant, name="Welcome Flow", defaults={"description": "Intro emails", "template": template}
            )[0],
        )
        if template and contact and email_list:
            safe(
                "email send",
                lambda: EmailSend.objects.get_or_create(
                    tenant=tenant,
                    recipient=contact,
                    template=template,
                    defaults={"email_list": email_list, "status": "sent", "sent_at": timezone.now(), "message_id": uuid.uuid4().hex},
                )[0],
            )

        self.stdout.write(self.style.SUCCESS("Dummy data created for git@apgroup.app"))
