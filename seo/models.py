from django.db import models
from django.urls import reverse
from django.utils import timezone


class PageMeta(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    keywords = models.TextField(
        blank=True,
        help_text='Comma separated keywords used for meta tags.',
    )
    canonical_url = models.URLField(blank=True)
    site = models.ForeignKey(
        'SiteProfile',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='pages',
    )
    is_indexable = models.BooleanField(
        default=True,
        help_text='Should search engines index this page?',
    )
    updated_at = models.DateTimeField(auto_now=True)

    def keyword_list(self) -> list[str]:
        return [
            keyword.strip()
            for keyword in self.keywords.split(',')
            if keyword.strip()
        ]

    def to_dict(self) -> dict[str, object]:
        return {
            'slug': self.slug,
            'title': self.title,
            'description': self.description,
            'keywords': self.keywords,
            'canonical_url': self.canonical_url,
            'is_indexable': self.is_indexable,
            'updated_at': self.updated_at.isoformat(),
            'backlinks': [backlink.to_dict() for backlink in self.backlinks.order_by('-created_at')[:10]],
            'site_id': self.site_id,
            'site': self.site.to_dict() if self.site else None,
        }

    def __str__(self) -> str:
        return f'{self.slug} — {self.title}'

    def get_absolute_url(self) -> str:
        return reverse('seo:page_detail', kwargs={'slug': self.slug})


class SiteProfile(models.Model):
    name = models.CharField(max_length=150)
    domain = models.URLField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def to_dict(self) -> dict[str, object]:
        return {
            'id': self.id,
            'name': self.name,
            'domain': self.domain,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
        }

    def __str__(self) -> str:
        return f'{self.name} ({self.domain})'


class Backlink(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('lost', 'Lost'),
        ('pending', 'Pending'),
    ]

    page = models.ForeignKey(
        PageMeta,
        on_delete=models.CASCADE,
        related_name='backlinks',
    )
    url = models.URLField()
    anchor_text = models.CharField(max_length=150, blank=True)
    source = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    is_follow = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def to_dict(self) -> dict[str, object]:
        return {
            'id': self.id,
            'url': self.url,
            'anchor_text': self.anchor_text,
            'source': self.source,
            'status': self.status,
            'is_follow': self.is_follow,
            'created_at': self.created_at.isoformat(),
        }

    def __str__(self) -> str:
        return f'Backlink {self.url} → {self.page.slug}'
