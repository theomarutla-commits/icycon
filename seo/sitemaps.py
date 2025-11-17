from django.contrib.sitemaps import Sitemap

from .models import PageMeta


class PageMetaSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.9
    protocol = 'https'

    def items(self):
        return PageMeta.objects.filter(is_indexable=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/seo/api/pages/{obj.slug}/'
