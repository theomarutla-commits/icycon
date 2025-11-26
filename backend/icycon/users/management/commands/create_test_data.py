from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
from seo.models import Site, ContentItem, KeywordCluster, FAQ
from social_media.models import SocialAccount, Post, Engagement, Comment
from analytics.models import AnalyticsEvent, PageView, UserSession
from users.models import OrganizationMembership
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates dummy data for SEO, Social Media, and Analytics'

    def create_test_organization(self):
        # Create an organization owner
        owner = User.objects.create_user(
            username='testorg',
            email='owner@testorganization.com',
            password='testpass123',
            is_organization=True,
            organization_name='Test Organization',
            organization_size='10-50',
            industry='Technology'
        )
        
        # Create some members
        member_types = [
            ('admin@testorg.com', 'admin'),
            ('editor@testorg.com', 'member'),
            ('viewer@testorg.com', 'viewer')
        ]
        
        members = []
        for email, role in member_types:
            user = User.objects.create_user(
                username=email.split('@')[0],
                email=email,
                password='testpass123'
            )
            OrganizationMembership.objects.create(
                user=user,
                organization=owner,
                role=role
            )
            members.append(user)
        
        return owner, members

    def create_seo_data(self, organization):
        # Create SEO Sites
        sites = []
        site_data = [
            ('Main Website', 'https://testorg.com'),
            ('Blog Platform', 'https://blog.testorg.com'),
            ('Documentation', 'https://docs.testorg.com')
        ]
        
        for name, url in site_data:
            site = Site.objects.create(
                organization=organization,
                name=name,
                url=url,
                status='active'
            )
            sites.append(site)

        # Create Content Items
        content_templates = [
            ('Product Overview', 'Detailed overview of our product features...'),
            ('Getting Started Guide', 'Step by step guide to get started...'),
            ('API Documentation', 'Complete API reference and examples...'),
            ('Best Practices', 'Learn the best practices for...'),
            ('Use Cases', 'Real-world examples and use cases...')
        ]

        for site in sites:
            for title_template, content_template in content_templates:
                ContentItem.objects.create(
                    site=site,
                    title=f"{title_template} - {site.name}",
                    content=f"{content_template} for {site.name}",
                    status=random.choice(['draft', 'published', 'published', 'published'])
                )

        # Create Keyword Clusters
        keyword_themes = [
            ('marketing', ['digital marketing', 'marketing strategy', 'online marketing']),
            ('analytics', ['data analytics', 'web analytics', 'business intelligence']),
            ('automation', ['workflow automation', 'marketing automation', 'business automation'])
        ]

        for site in sites:
            for theme, keywords in keyword_themes:
                KeywordCluster.objects.create(
                    site=site,
                    name=f"{theme.title()} Keywords - {site.name}",
                    main_keyword=theme,
                    related_keywords=keywords
                )

        # Create FAQs
        faq_templates = [
            ('How do I get started?', 'Getting started is easy! Simply...'),
            ('What are the pricing plans?', 'We offer flexible pricing plans...'),
            ('Is there an API available?', 'Yes, we provide a comprehensive API...'),
            ('How does support work?', 'Our support team is available 24/7...')
        ]

        for site in sites:
            for question, answer in faq_templates:
                FAQ.objects.create(
                    site=site,
                    question=f"{question} ({site.name})",
                    answer=f"{answer} for {site.name}"
                )

    def create_social_data(self, organization, members):
        # Create Social Accounts
        platforms = [
            ('x', '@testorg_twitter'),
            ('linkedin', 'testorg-company'),
            ('instagram', '@testorg_official'),
            ('tiktok', '@testorg_tiktok')
        ]
        
        accounts = []
        for platform, handle in platforms:
            account = SocialAccount.objects.create(
                tenant=organization,
                platform=platform,
                handle=handle,
                oauth_tokens={'access_token': 'dummy_token'}
            )
            accounts.append(account)

        # Create Posts
        post_types = ['article', 'news', 'tutorial']
        post_templates = [
            ('Introducing New Features', 'We are excited to announce...'),
            ('How to Optimize Your Workflow', 'Learn these essential tips...'),
            ('Case Study: Customer Success', 'See how our customers achieve...'),
            ('Product Updates', 'Check out our latest improvements...'),
            ('Industry Insights', 'Latest trends in the industry...')
        ]

        for _ in range(20):
            post = Post.objects.create(
                tenant=organization,
                author=random.choice(members),
                title=random.choice(post_templates)[0],
                content=random.choice(post_templates)[1],
                post_type=random.choice(post_types),
                status=random.choice(['draft', 'published', 'published', 'scheduled']),
                platforms=[account.platform for account in random.sample(accounts, random.randint(1, len(accounts)))],
                scheduled_at=timezone.now() + timedelta(days=random.randint(-10, 10)),
                tags=['marketing', 'technology', 'business'],
                seo_keywords=['growth', 'optimization', 'strategy']
            )

            # Create engagement metrics
            if post.status == 'published':
                Engagement.objects.create(
                    post=post,
                    platform=random.choice([acc.platform for acc in accounts]),
                    likes=random.randint(10, 1000),
                    shares=random.randint(5, 200),
                    comments=random.randint(1, 50),
                    clicks=random.randint(20, 500),
                    impressions=random.randint(1000, 10000),
                    reach=random.randint(500, 5000)
                )

                # Create some comments
                for _ in range(random.randint(2, 5)):
                    Comment.objects.create(
                        post=post,
                        author=random.choice(members),
                        content=f"Great post! {random.randint(1, 1000)}",
                        is_approved=True
                    )

    def create_analytics_data(self, organization):
        # Create Analytics Events
        event_types = ['page_view', 'button_click', 'form_submit', 'file_download']
        pages = ['/', '/features', '/pricing', '/docs', '/blog', '/contact']
        
        for _ in range(100):
            event_time = timezone.now() - timedelta(days=random.randint(0, 30))
            AnalyticsEvent.objects.create(
                organization=organization,
                event_type=random.choice(event_types),
                event_data={
                    'page': random.choice(pages),
                    'user_agent': 'Mozilla/5.0',
                    'referrer': random.choice(['google.com', 'twitter.com', 'linkedin.com', '']),
                },
                timestamp=event_time
            )

        # Create Page Views
        browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
        devices = ['desktop', 'mobile', 'tablet']
        
        for _ in range(200):
            view_time = timezone.now() - timedelta(days=random.randint(0, 30))
            PageView.objects.create(
                organization=organization,
                page_url=random.choice(pages),
                user_agent=f"{random.choice(browsers)} on {random.choice(devices)}",
                referrer=random.choice(['google.com', 'twitter.com', 'linkedin.com', '']),
                timestamp=view_time,
                duration=random.randint(10, 300)
            )

        # Create User Sessions
        for _ in range(50):
            session_start = timezone.now() - timedelta(days=random.randint(0, 30))
            UserSession.objects.create(
                organization=organization,
                session_id=f"session_{random.randint(1000, 9999)}",
                user_agent=f"{random.choice(browsers)} on {random.choice(devices)}",
                start_time=session_start,
                end_time=session_start + timedelta(minutes=random.randint(1, 60)),
                pages_viewed=random.randint(1, 10)
            )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Creating test data...')
        
        # Create organization and members
        organization, members = self.create_test_organization()
        self.stdout.write(f'Created organization: {organization.organization_name}')
        
        # Create data for each app
        self.create_seo_data(organization)
        self.stdout.write('Created SEO data')
        
        self.create_social_data(organization, members)
        self.stdout.write('Created Social Media data')
        
        self.create_analytics_data(organization)
        self.stdout.write('Created Analytics data')
        
        self.stdout.write(self.style.SUCCESS('Successfully created all test data'))
        self.stdout.write('\nTest Account Credentials:')
        self.stdout.write('Organization Owner:')
        self.stdout.write('Email: owner@testorganization.com')
        self.stdout.write('Password: testpass123')
        self.stdout.write('\nOther test accounts:')
        self.stdout.write('Admin: admin@testorg.com / testpass123')
        self.stdout.write('Editor: editor@testorg.com / testpass123')
        self.stdout.write('Viewer: viewer@testorg.com / testpass123')