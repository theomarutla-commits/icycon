from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid
import random
from datetime import timedelta

from tenants.models import Tenant, TenantUser
from aso.models import App as ASOApp, AppKeyword, AppListing
from marketplace.models import Product, Order, Review, SavedProduct, Conversation, Message
from analytics.models import Site as AnalyticsSite, PageView
from seo.models import Site as SEOSite, ContentItem as SEOContentItem, FAQ as SEOFAQ, KeywordCluster as SEOKeywordCluster
from social_media.models import SocialAccount, Post, Comment, Engagement
from email_engine.models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend

User = get_user_model()


class Command(BaseCommand):
    help = "Create dummy data for git@apgroup.app across all major features."

    def add_arguments(self, parser):
        parser.add_argument("--email", default="git@apgroup.app", help="Target user email")
        parser.add_argument("--password", default="Password123!", help="Password to set if user is created")
        parser.add_argument("--tenant", default="APGroup Tenant", help="Tenant name to create/use")

    def handle(self, *args, **opts):
        email = opts["email"]
        password = opts["password"]
        tenant_name = opts["tenant"]
        username = email.split("@")[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username, "first_name": "AP", "last_name": "Group"},
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user {email}"))
        else:
            self.stdout.write(f"Using existing user {email}")

        tenant, _ = Tenant.objects.get_or_create(name=tenant_name, defaults={"region": "US", "plan": "free"})
        TenantUser.objects.get_or_create(user=user, tenant=tenant, defaults={"role": "owner"})

        # ASO
        aso_app, _ = ASOApp.objects.get_or_create(
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
        )
        AppKeyword.objects.get_or_create(app=aso_app, keyword="apgroup", defaults={"position": 5, "search_volume": 1200})
        AppListing.objects.get_or_create(
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
        )

        # Marketplace
        product, _ = Product.objects.get_or_create(
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
        )
        SavedProduct.objects.get_or_create(user=user, product=product)
        order, _ = Order.objects.get_or_create(
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
        )
        Review.objects.get_or_create(
            product=product,
            reviewer=user,
            tenant=tenant,
            defaults={"rating": 5, "title": "Great tool", "comment": "Loving the APGroup demo product."},
        )
        conv, _ = Conversation.objects.get_or_create(
            product=product, buyer_tenant=tenant, seller_tenant=tenant, defaults={"subject": "Demo conversation"}
        )
        Message.objects.get_or_create(conversation=conv, sender=user, defaults={"content": "Is support included?"})

        # Analytics
        analytics_site, _ = AnalyticsSite.objects.get_or_create(
            tenant=tenant, domain="https://apgroup.app", defaults={"sitemaps_url": "https://apgroup.app/sitemap.xml"}
        )
        PageView.objects.get_or_create(
            site=analytics_site,
            url="https://apgroup.app/",
            visitor_id="visitor-1",
            defaults={"duration": 120, "bounce": False, "referrer": "https://google.com"},
        )

        # SEO
        seo_site, _ = SEOSite.objects.get_or_create(
            tenant=tenant, domain="https://apgroup.app", defaults={"sitemaps_url": "https://apgroup.app/sitemap.xml"}
        )
        SEOContentItem.objects.get_or_create(
            tenant=tenant,
            type="blog",
            url="https://apgroup.app/blog/demo-post",
            defaults={"status": "published", "locale": "en", "brief_json": {"title": "Demo Post"}},
        )
        SEOFAQ.objects.get_or_create(
            tenant=tenant,
            question="What is APGroup?",
            defaults={"answer": "APGroup demo answer", "source_urls": ["https://apgroup.app"]},
        )
        SEOKeywordCluster.objects.get_or_create(
            tenant=tenant,
            intent="demo",
            defaults={"locale": "en", "terms": ["apgroup", "demo", "productivity suite"]},
        )

        # Social
        social_account, _ = SocialAccount.objects.get_or_create(
            tenant=tenant, platform="linkedin", handle="apgroup", defaults={"oauth_tokens": {}}
        )
        post, _ = Post.objects.get_or_create(
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
        )
        Comment.objects.get_or_create(post=post, author=user, defaults={"content": "Excited to try this!"})
        Engagement.objects.get_or_create(
            post=post,
            platform="linkedin",
            defaults={"likes": 10, "shares": 2, "comments": 1, "clicks": 15, "impressions": 200, "reach": 180},
        )

        # Email
        email_list, _ = EmailList.objects.get_or_create(
            tenant=tenant, name="APGroup Demo List", defaults={"lawful_basis": "consent", "region": "US"}
        )
        contact, _ = Contact.objects.get_or_create(tenant=tenant, email=email, defaults={"name": "APGroup Contact"})
        template, _ = EmailTemplate.objects.get_or_create(
            tenant=tenant,
            name="Welcome",
            defaults={"subject": "Welcome to APGroup", "body_html": "<p>Welcome!</p>", "body_text": "Welcome!"},
        )
        flow, _ = EmailFlow.objects.get_or_create(
            tenant=tenant, name="Welcome Flow", defaults={"description": "Intro emails", "template": template}
        )
        EmailSend.objects.get_or_create(
            tenant=tenant,
            recipient=contact,
            template=template,
            defaults={"email_list": email_list, "status": "sent", "sent_at": timezone.now(), "message_id": uuid.uuid4().hex},
        )

        self.stdout.write(self.style.SUCCESS("Dummy data created for git@apgroup.app"))
