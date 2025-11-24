from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid
import random
from datetime import timedelta

from tenants.models import Tenant, TenantUser
from marketplace.models import Product, Order, Review, SavedProduct, Conversation, Message
from seo.models import Site as SeoSite, ContentItem as SeoContent
from analytics.models import Site as AnalyticsSite, PageView
from social.models import Post, SocialLog

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo user and example data across the platform (expanded)'

    def add_arguments(self, parser):
        parser.add_argument('--username', default='demo_user', help='Username for demo owner user')
        parser.add_argument('--email', default='demo@example.com', help='Email for demo owner user')
        parser.add_argument('--password', default='demo1234', help='Password for demo owner user')
        parser.add_argument('--products', type=int, default=10, help='Number of products to create')
        parser.add_argument('--orders', type=int, default=50, help='Number of orders to create')
        parser.add_argument('--reviews', type=int, default=40, help='Number of reviews to create')
        parser.add_argument('--pageviews', type=int, default=200, help='Number of pageviews to create')
        parser.add_argument('--posts', type=int, default=10, help='Number of social posts to create')
        parser.add_argument('--clear-first', action='store_true', help='Clear existing demo tenants/users first (names starting with "Demo")')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        num_products = options['products']
        num_orders = options['orders']
        num_reviews = options['reviews']
        num_pageviews = options['pageviews']
        num_posts = options['posts']
        clear_first = options['clear_first']

        prefix = 'Demo'

        self.stdout.write('Seeding demo data (expanded)...')

        if clear_first:
            self.stdout.write('Clearing existing demo tenants and users (prefix: Demo)')
            Tenant.objects.filter(name__startswith=prefix).delete()
            User.objects.filter(username__startswith='demo_').delete()

        # Create or get demo tenant and owner user
        tenant, _ = Tenant.objects.get_or_create(name='Demo Tenant', defaults={'region': 'US', 'plan': 'free'})

        owner, created = User.objects.get_or_create(username=username, defaults={'email': email, 'first_name': 'Demo', 'last_name': 'User'})
        if created:
            owner.set_password(password)
            owner.organization_name = 'Demo Org'
            owner.save()
            self.stdout.write(f'Created owner user {username}')
        TenantUser.objects.get_or_create(user=owner, tenant=tenant, defaults={'role': 'owner'})

        # Create seller tenant & seller user
        seller_tenant, _ = Tenant.objects.get_or_create(name='Demo Seller', defaults={'region': 'US', 'plan': 'free'})
        seller_user, seller_created = User.objects.get_or_create(username='demo_seller', defaults={'email': 'seller@example.com', 'first_name': 'Seller', 'last_name': 'Demo'})
        if seller_created:
            seller_user.set_password('seller1234')
            seller_user.save()
        TenantUser.objects.get_or_create(user=seller_user, tenant=seller_tenant, defaults={'role': 'owner'})

        # Create additional demo buyers under demo tenant
        buyers = [owner]
        for i in range(1, 6):
            uname = f'demo_buyer_{i}'
            u, uc = User.objects.get_or_create(username=uname, defaults={'email': f'{uname}@example.com', 'first_name': 'Buyer', 'last_name': str(i)})
            if uc:
                u.set_password('buyer1234')
                u.save()
            TenantUser.objects.get_or_create(user=u, tenant=tenant, defaults={'role': 'viewer'})
            buyers.append(u)

        # Create products
        products = []
        categories = [c[0] for c in Product.CATEGORY_CHOICES]
        for i in range(num_products):
            title = f'Demo Product {i+1}'
            prod, _ = Product.objects.get_or_create(
                title=title,
                tenant=seller_tenant,
                created_by=seller_user,
                defaults={
                    'description': f'A demo product number {i+1}',
                    'category': random.choice(categories),
                    'status': 'published',
                    'pricing_type': random.choice(['fixed', 'free', 'subscription']),
                    'price': round(random.uniform(0, 199), 2),
                    'subscription_price': round(random.uniform(5, 49), 2),
                    'subscription_interval': random.choice(['monthly', 'yearly']),
                    'features': [f'Feature {j}' for j in range(1, 4)],
                    'tags': ['demo', 'sample'],
                    'published_at': timezone.now() - timedelta(days=random.randint(0, 30)),
                }
            )
            products.append(prod)

        # Ensure at least one product exists (fallback to previous product creation)
        if not products:
            prod = Product.objects.create(title='Demo Analytics Plugin', tenant=seller_tenant, created_by=seller_user, description='Fallback demo product', category='analytics', status='published', pricing_type='fixed', price=49.99, published_at=timezone.now())
            products.append(prod)

        # Save a few products for owner
        for p in products[:3]:
            SavedProduct.objects.get_or_create(user=owner, product=p)

        # Create orders
        orders = []
        for i in range(num_orders):
            prod = random.choice(products)
            buyer = random.choice(buyers)
            order_number = f'ORD-{uuid.uuid4().hex[:10].upper()}'
            quantity = random.randint(1, 3)
            unit_price = prod.price or round(random.uniform(5, 199), 2)
            total_price = round(unit_price * quantity, 2)
            status = random.choices(['pending', 'confirmed', 'processing', 'completed'], weights=[0.1,0.2,0.2,0.5])[0]
            payment_status = 'completed' if status == 'completed' else random.choice(['pending', 'failed'])
            order = Order.objects.create(
                order_number=order_number,
                product=prod,
                buyer_tenant=tenant,
                buyer_user=buyer,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price,
                status=status,
                customer_email=buyer.email,
                payment_status=payment_status,
                access_token=uuid.uuid4().hex if prod.pricing_type != 'free' else None,
            )
            orders.append(order)

        # Create reviews (unique constraint enforced)
        review_count = 0
        for i in range(num_reviews):
            prod = random.choice(products)
            reviewer = random.choice(buyers)
            try:
                rv, created = Review.objects.get_or_create(product=prod, reviewer=reviewer, tenant=tenant, defaults={
                    'rating': random.randint(3, 5),
                    'title': f'Nice {prod.title}',
                    'comment': 'This is a helpful demo review.',
                    'verified_purchase': True,
                })
                if created:
                    review_count += 1
            except Exception:
                # skip duplicates or invalid
                continue

        # Create conversations and messages for a subset of orders
        for o in orders[:min(len(orders), 10)]:
            conv, _ = Conversation.objects.get_or_create(product=o.product, buyer_tenant=o.buyer_tenant, seller_tenant=seller_tenant, defaults={'subject': 'Question about product'})
            Message.objects.create(conversation=conv, sender=o.buyer_user, content='Is setup difficult?')
            Message.objects.create(conversation=conv, sender=seller_user, content='It is easy — follow the install guide.')

        # SEO site & content for tenant
        seo_site, _ = SeoSite.objects.get_or_create(tenant=tenant, domain='https://demo.example.com', defaults={'sitemaps_url': 'https://demo.example.com/sitemap.xml'})
        for i in range(2):
            SeoContent.objects.get_or_create(tenant=tenant, type='blog', url=f'https://demo.example.com/blog/post-{i+1}', defaults={'status': 'published', 'brief_json': {'title': f'Post {i+1}'}, 'draft_html': f'<p>Post {i+1} content</p>'})

        # Analytics site and pageviews
        a_site, _ = AnalyticsSite.objects.get_or_create(tenant=tenant, domain='https://demo.example.com')
        for i in range(num_pageviews):
            ts = timezone.now() - timedelta(days=random.randint(0, 30), seconds=random.randint(0, 86400))
            PageView.objects.create(site=a_site, url='https://demo.example.com/', visitor_id=f'visitor-{random.randint(1,200)}', duration=random.randint(10, 600), bounce=random.choice([True, False]), referrer=random.choice(['', 'https://google.com', 'https://twitter.com']))

        # Social posts and logs
        for i in range(num_posts):
            Post.objects.create(tenant=tenant, platform='linkedin', status='posted', body=f'Demo post {i+1} announcing product updates', posted_at=timezone.now() - timedelta(days=random.randint(0,30)))
            SocialLog.objects.create(tenant=tenant, platform='linkedin', action='post', message=f'Posted demo update {i+1}', timestamp=timezone.now() - timedelta(days=random.randint(0,30)))

        self.stdout.write(self.style.SUCCESS(f'Demo data seeded: products={len(products)} orders={len(orders)} reviews={review_count} pageviews={num_pageviews} posts={num_posts}'))
