from django.conf import settings
from django.db import models


class AppListing(models.Model):
    STORE_CHOICES = [
        ('apple', 'App Store'),
        ('google', 'Google Play'),
        ('amazon', 'Amazon'),
        ('other', 'Other'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='aso_listings',
    )
    name = models.CharField(max_length=200)
    store = models.CharField(max_length=15, choices=STORE_CHOICES, default='other')
    bundle_id = models.CharField(max_length=200, help_text='Bundle or package identifier')
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    downloads = models.PositiveIntegerField(default=0)
    icon_url = models.URLField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_updated']

    def __str__(self) -> str:
        return f'{self.name} ({self.get_store_display()})'


class AppMetric(models.Model):
    listing = models.ForeignKey(
        AppListing,
        on_delete=models.CASCADE,
        related_name='metrics',
    )
    field = models.CharField(max_length=80)
    value = models.CharField(max_length=150)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']

    def __str__(self) -> str:
        return f'{self.field}: {self.value}'
