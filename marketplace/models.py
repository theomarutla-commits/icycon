from django.conf import settings
from django.db import models


class ProductService(models.Model):
    KIND_CHOICES = [
        ('product', 'Product'),
        ('service', 'Service'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='marketplace_items',
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default='product')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self) -> str:
        return f'{self.name} ({self.kind})'


class Sale(models.Model):
    product = models.ForeignKey(
        ProductService,
        on_delete=models.CASCADE,
        related_name='sales',
    )
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.CharField(max_length=250, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'Sale #{self.pk} – {self.product.name}'


class Interaction(models.Model):
    CHANNEL_CHOICES = [
        ('email', 'Email'),
        ('call', 'Call'),
        ('meeting', 'Meeting'),
        ('social', 'Social'),
        ('other', 'Other'),
    ]

    product = models.ForeignKey(
        ProductService,
        on_delete=models.CASCADE,
        related_name='interactions',
    )
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.channel} – {self.product.name}'
