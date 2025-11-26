from django.db import models
from django.conf import settings

# Create your models here.

class Tenant(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=50, choices=[
        ("US", "United States"),
        ("EU", "Europe"),
        ("UK", "United Kingdom"),
        ("ZA", "South Africa"),
        ("APAC", "Asia-Pacific"),
    ])
    plan = models.CharField(max_length=50, default="free")
    brand_tone = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TenantUser(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("editor", "Editor"),
        ("viewer", "Viewer"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")

    class Meta:
        unique_together = ("user", "tenant")

    def __str__(self):
        return f"{self.user.username} ({self.role}) - {self.tenant.name}"


class Integration(models.Model):
    INTEGRATION_TYPES = [
        ("gsc", "Google Search Console"),
        ("gbp", "Google Business Profile"),
        ("youtube", "YouTube"),
        ("dataforseo", "DataForSEO"),
        ("sendgrid", "SendGrid"),
        ("ses", "Amazon SES"),
        ("custom", "Custom Integration"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="integrations")
    type = models.CharField(max_length=50, choices=INTEGRATION_TYPES)
    oauth_tokens = models.JSONField(default=dict)
    scopes = models.JSONField(default=list)
    metadata = models.JSONField(default=dict, blank=True)
    connected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.type}"
