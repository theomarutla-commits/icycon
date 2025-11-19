from __future__ import annotations

import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import SocialMediaPost, SocialMediaProfile
from seo.models import Backlink, DirectoryListing, PageMeta, SiteProfile


class Command(BaseCommand):
    help = 'Seed seven demo users plus SEO, ASO, marketplace, and social data for the dashboards.'

    USER_TEMPLATE = [
        {
            'username': 'seo_lead',
            'email': 'seo_lead@example.com',
            'full_name': 'Seo Lead',
            'password': 'Demo1234!',
            'site': {
                'name': 'Seo Lead Showcase',
                'domain': 'https://seolead.example.com',
                'description': 'Authority site with rigorous SEO experiments.',
            },
            'slug': 'seo-lead',
            'keywords': 'seo,dashboard,backlinks,analytics',
            'backlinks': [
                'https://searchenginejournal.com/seo-lead-case-study',
                'https://moz.com/blog/seo-review',
            ],
            'social': [
                {'platform': 'twitter', 'handle': 'seo_lead', 'description': 'Metadata evangelist.'},
                {'platform': 'linkedin', 'handle': 'seo-lead', 'description': 'Growth storyteller.'},
            ],
        },
        {
            'username': 'aso_win',
            'email': 'aso_win@example.com',
            'full_name': 'ASO Win',
            'password': 'Demo1234!',
            'site': {
                'name': 'ASO Win Labs',
                'domain': 'https://aso-win.example.com',
                'description': 'App store optimization lab experiments.',
            },
            'slug': 'aso-win',
            'keywords': 'aso,app-store,keywords',
            'backlinks': [
                'https://appreview.com/aso-win',
                'https://appstorewatch.com/aso-insights',
            ],
            'social': [
                {'platform': 'instagram', 'handle': 'aso_win', 'description': 'Creative preview specialist.'},
            ],
        },
        {
            'username': 'market_maven',
            'email': 'market_maven@example.com',
            'full_name': 'Marketplace Maven',
            'password': 'Demo1234!',
            'site': {
                'name': 'Marketplace Maven Store',
                'domain': 'https://marketmaven.example.com',
                'description': 'High-converting marketplace storefront.',
            },
            'slug': 'market-maven',
            'keywords': 'marketplace,ecommerce,listings',
            'backlinks': [
                'https://shopify.com/market-maven',
                'https://g2.com/reviews/marketplace-maven',
            ],
            'social': [
                {'platform': 'facebook', 'handle': 'market_maven', 'description': 'Community builder.'},
            ],
        },
        {
            'username': 'social_spark',
            'email': 'social_spark@example.com',
            'full_name': 'Social Spark',
            'password': 'Demo1234!',
            'site': {
                'name': 'Social Spark Studio',
                'domain': 'https://socialspark.example.com',
                'description': 'Social-first automation tracker.',
            },
            'slug': 'social-spark',
            'keywords': 'social,automation,media',
            'backlinks': [
                'https://buffer.com/library/social-spark-case-study',
            ],
            'social': [
                {'platform': 'tiktok', 'handle': 'social_spark', 'description': 'Short-form strategist.'},
            ],
        },
        {
            'username': 'apollo_ai',
            'email': 'apollo_ai@example.com',
            'full_name': 'Apollo AI',
            'password': 'Demo1234!',
            'site': {
                'name': 'Apollo AI Labs',
                'domain': 'https://apolloai.example.com',
                'description': 'AI growth experiments for every channel.',
            },
            'slug': 'apollo-ai',
            'keywords': 'ai,automation,insights',
            'backlinks': [
                'https://techcrunch.com/apollo-ai-trends',
                'https://venturebeat.com/apollo-ai-growth',
            ],
            'social': [
                {'platform': 'linkedin', 'handle': 'apollo-ai', 'description': 'AI operator.'},
            ],
        },
        {
            'username': 'analytics_ace',
            'email': 'analytics_ace@example.com',
            'full_name': 'Analytics Ace',
            'password': 'Demo1234!',
            'site': {
                'name': 'Analytics Ace Insights',
                'domain': 'https://analyticsace.example.com',
                'description': 'Performance dashboards paired with SEO data.',
            },
            'slug': 'analytics-ace',
            'keywords': 'analytics,insights,metrics',
            'backlinks': [
                'https://datastudio.google.com/analytics-ace-report',
                'https://brightedge.com/analytics-ace',
            ],
            'social': [
                {'platform': 'twitter', 'handle': 'analytics_ace', 'description': 'Metrics storyteller.'},
                {'platform': 'youtube', 'handle': 'analytics-ace', 'description': 'Data story videos.'},
            ],
        },
        {
            'username': 'brand_signal',
            'email': 'brand_signal@example.com',
            'full_name': 'Brand Signal',
            'password': 'Demo1234!',
            'site': {
                'name': 'Brand Signal Network',
                'domain': 'https://brandsignal.example.com',
                'description': 'Brand and reputation monitoring hub.',
            },
            'slug': 'brand-signal',
            'keywords': 'brand,reputation,monitoring',
            'backlinks': [
                'https://brandwatch.com/brand-signal',
                'https://semrush.com/brand-signal',
            ],
            'social': [
                {'platform': 'linkedin', 'handle': 'brand-signal', 'description': 'Brand guardian.'},
            ],
        },
    ]

    DIRECTORY_SAMPLES = [
        {
            'name': 'Global SaaS Directory',
            'url': 'https://dir.global-saas.com',
            'description': 'Curated SaaS vendors.',
            'contact_email': 'tips@global-saas.com',
        },
        {
            'name': 'AI & Automation Listings',
            'url': 'https://list.automation.ai',
            'description': 'AI-first companies.',
            'contact_email': 'hello@automation.ai',
        },
        {
            'name': 'Startup Spotlight',
            'url': 'https://startupspotlight.com',
            'description': 'Emerging brands getting traction.',
            'contact_email': 'info@startupspotlight.com',
        },
    ]

    def handle(self, *args, **options):
        User = get_user_model()
        for seed in self.USER_TEMPLATE:
            user, created = User.objects.get_or_create(
                username=seed['username'],
                defaults={
                    'email': seed['email'],
                    'first_name': seed['full_name'].split(' ', 1)[0],
                    'last_name': seed['full_name'].split(' ', 1)[-1],
                },
            )
            if created:
                user.set_password(seed['password'])
                user.save()

            site, _ = SiteProfile.objects.get_or_create(
                domain=seed['site']['domain'],
                defaults={
                    'name': seed['site']['name'],
                    'description': seed['site']['description'],
                },
            )

            page, _ = PageMeta.objects.get_or_create(
                slug=seed['slug'],
                defaults={
                    'title': seed['site']['name'],
                    'description': seed['site']['description'],
                    'keywords': seed['keywords'],
                    'canonical_url': site.domain,
                    'site': site,
                },
            )
            page.keywords = seed['keywords']
            page.canonical_url = site.domain
            page.site = site
            page.save()

            for url in seed['backlinks']:
                Backlink.objects.get_or_create(
                    page=page,
                    url=url,
                    defaults={
                        'anchor_text': f'{page.title} mention',
                        'source': 'Demo campaign',
                        'status': random.choice(['active', 'pending']),
                        'is_follow': True,
                        'created_at': timezone.now() - timedelta(days=random.randint(1, 30)),
                    },
                )

            for profile_data in seed['social']:
                profile, _ = SocialMediaProfile.objects.get_or_create(
                    user=user,
                    platform=profile_data['platform'],
                    handle=profile_data['handle'],
                    defaults={
                        'url': f'https://{profile_data["platform"]}.com/{profile_data["handle"]}',
                        'description': profile_data['description'],
                    },
                )
                SocialMediaPost.objects.create(
                    profile=profile,
                    caption=f'Demo post from {seed["full_name"]} on {profile.platform.title()}',
                    scheduled_at=timezone.now() + timedelta(days=1),
                    posted_at=timezone.now() - timedelta(days=1),
                )

        for directory in self.DIRECTORY_SAMPLES:
            DirectoryListing.objects.get_or_create(
                url=directory['url'],
                defaults=directory,
            )

        self.stdout.write(self.style.SUCCESS('Seeded seven dummy users with filled dashboards.'))
