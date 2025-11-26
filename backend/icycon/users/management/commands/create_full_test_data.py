from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction
import random

from tenants.models import Tenant, TenantUser
from users.models import OrganizationMembership
from seo.models import Site, ContentItem, KeywordCluster, FAQ
from social_media.models import SocialAccount, Post, Engagement, Comment
from analytics.models import PageView

from email_engine.services.notifications import send_account_created_notifications

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a tenant, users, SEO, social media and analytics test data and trigger email sends.'

    def create_tenant_and_users(self):
        tenant = Tenant.objects.filter(name='Test Company').first()
        if not tenant:
            tenant = Tenant.objects.create(
                name='Test Company',
                region='US',
                plan='free',
                brand_tone='Professional and helpful'
            )

        # Create a User that represents the organization (so code that expects a user-org works)
        org_user = User.objects.filter(username='testcompany_org').first()
        if not org_user:
            org_user = User.objects.create_user(
                username='testcompany_org',
                email='org@testcompany.com',
                password='testpass123',
                organization_name=tenant.name,
                first_name='Test',
                last_name='Company'
            )

        # Link org_user to tenant (idempotent)
        TenantUser.objects.get_or_create(user=org_user, tenant=tenant, defaults={'role': 'owner'})

        # Owner user (represents a human owner/admin)
        owner = User.objects.filter(username='owner_testcompany').first()
        if not owner:
            owner = User.objects.create_user(
                username='owner_testcompany',
                email='owner@testcompany.com',
                password='testpass123',
                first_name='Owner',
                last_name='Test'
            )

        TenantUser.objects.get_or_create(user=owner, tenant=tenant, defaults={'role': 'owner'})

        # Associate the human owner with the org User via OrganizationMembership (idempotent)
        OrganizationMembership.objects.get_or_create(member=owner, organization=org_user, defaults={'role': 'owner'})

        # Create a few member users
        members = []
        member_data = [
            ('admin@testcompany.com', 'admin'),
            ('editor@testcompany.com', 'editor'),
            ('viewer@testcompany.com', 'viewer'),
        ]

        for email, role in member_data:
            username = email.split('@')[0]
            u = User.objects.filter(username=username).first()
            if not u:
                u = User.objects.create_user(username=username, email=email, password='testpass123')

            TenantUser.objects.get_or_create(user=u, tenant=tenant, defaults={'role': role})
            OrganizationMembership.objects.get_or_create(member=u, organization=org_user, defaults={'role': role})
            members.append(u)

        return tenant, owner, members

    def create_seo(self, tenant):
        sites = []
        domains = ['https://testcompany.com', 'https://blog.testcompany.com']
        for d in domains:
            site, _ = Site.objects.get_or_create(tenant=tenant, domain=d, defaults={'default_locale': 'en'})
            sites.append(site)

        for site in sites:
            # Idempotent content item
            ci = ContentItem.objects.filter(tenant=tenant, type='blog', url=f"{site.domain}/welcome").first()
            if not ci:
                ContentItem.objects.create(
                    tenant=tenant,
                    type='blog',
                    url=f"{site.domain}/welcome",
                    status='published',
                    brief_json={'summary': 'Welcome post'}
                )

            # Keyword cluster (avoid MultipleObjectsReturned by using filter)
            kc = KeywordCluster.objects.filter(tenant=tenant, intent='marketing').first()
            if not kc:
                KeywordCluster.objects.create(
                    tenant=tenant,
                    intent='marketing',
                    terms=['marketing', 'growth', 'seo']
                )

            # FAQ (idempotent)
            faq = FAQ.objects.filter(tenant=tenant, question='How do I get started?').first()
            if not faq:
                FAQ.objects.create(
                    tenant=tenant,
                    question='How do I get started?',
                    answer='Sign up and follow the setup guide.'
                )

    def create_social(self, tenant, members):
        accounts = []
        platforms = [('x', '@testcompany'), ('linkedin', 'testcompany')]
        for platform, handle in platforms:
            acct, _ = SocialAccount.objects.get_or_create(tenant=tenant, platform=platform, handle=handle)
            accounts.append(acct)

        for i in range(8):
            author = random.choice(members)
            title = f"Test Post {i}"
            post_status = random.choice(['draft', 'published', 'scheduled'])
            post, created = Post.objects.get_or_create(
                tenant=tenant,
                author=author,
                title=title,
                defaults={
                    'content': 'This is a sample post for test data',
                    'post_type': 'post',
                    'status': post_status,
                    'platforms': [a.platform for a in accounts],
                    'scheduled_at': timezone.now()
                }
            )

            if post.status == 'published':
                # Create one engagement per published post (idempotent create)
                Engagement.objects.get_or_create(post=post, platform=accounts[0].platform, defaults={'likes': random.randint(1, 100)})
                for _ in range(random.randint(0, 3)):
                    Comment.objects.get_or_create(post=post, author=author, content='Nice post!', defaults={'is_approved': True})

    def create_analytics(self, tenant):
        pages = ['/', '/pricing', '/docs']

        # PageView: attach to an existing Site if available
        site = Site.objects.filter(tenant=tenant).first()
        if site:
            for _ in range(60):
                try:
                    PageView.objects.create(
                        site=site,
                        url=random.choice(pages),
                        visitor_id=f"v{random.randint(1000,9999)}",
                        duration=random.randint(5, 300),
                        referrer=''
                    )
                except Exception:
                    pass

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Creating tenant, users and test data...')

        tenant, owner, members = self.create_tenant_and_users()
        self.stdout.write(self.style.SUCCESS(f'Created tenant: {tenant.name}'))

        # Create app data
        self.create_seo(tenant)
        self.stdout.write('Created SEO data')

        self.create_social(tenant, members)
        self.stdout.write('Created Social Media data')

        self.create_analytics(tenant)
        self.stdout.write('Created Analytics data')

        # Trigger email notifications for account creation
        try:
            send_account_created_notifications(tenant, owner)
            self.stdout.write(self.style.SUCCESS('Triggered account created notifications (email_engine)'))
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f'Failed to send notifications: {exc}'))

        self.stdout.write(self.style.SUCCESS('Finished creating full test data'))
