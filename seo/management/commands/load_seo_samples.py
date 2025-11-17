from django.core.management.base import BaseCommand

from seo.models import PageMeta

SAMPLE_PAGES = [
    {
        'slug': 'homepage',
        'title': 'Icycon | Digital Presence',
        'description': 'Homepage metadata optimized for conversions and recall.',
        'keywords': 'icycon, marketing, digital experience',
        'canonical_url': 'https://icycon.dev/',
        'is_indexable': True,
    },
    {
        'slug': 'product',
        'title': 'Product | Icycon',
        'description': 'Highlights features and value to close leads.',
        'keywords': 'product, features, conversion',
        'canonical_url': 'https://icycon.dev/product',
        'is_indexable': True,
    },
    {
        'slug': 'blog',
        'title': 'Learn | Icycon Blog',
        'description': 'Long-form content for SEO-friendly storytelling.',
        'keywords': 'blog, seo, stories',
        'canonical_url': 'https://icycon.dev/blog',
        'is_indexable': True,
    },
]


class Command(BaseCommand):
    help = 'Load sample SEO metadata into the database.'

    def handle(self, *args, **kwargs):
        for sample in SAMPLE_PAGES:
            obj, created = PageMeta.objects.update_or_create(
                slug=sample['slug'], defaults=sample
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'{action} metadata for {obj.slug}')
