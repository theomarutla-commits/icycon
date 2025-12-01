import re
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings

class User(AbstractUser):
    """
    Custom user model that incorporates tenant functionality
    """
    # Tenant-specific fields
    organization_name = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=50, choices=[
        ("US", "United States"),
        ("EU", "Europe"),
        ("UK", "United Kingdom"),
        ("ZA", "South Africa"),
        ("APAC", "Asia-Pacific"),
    ], blank=True)
    plan = models.CharField(max_length=50, default="free")
    brand_tone = models.TextField(blank=True, null=True)
    organization_created_at = models.DateTimeField(null=True, blank=True)
    
    # User role within their organization
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("editor", "Editor"),
        ("viewer", "Viewer"),
    ]
    phone_number = models.CharField(max_length=32, blank=True)
    organization_role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES,
        default="owner"
    )
    
    # Organization memberships (for users belonging to multiple organizations)
    member_of = models.ManyToManyField(
        'self',
        through='OrganizationMembership',
        through_fields=('member', 'organization'),
        symmetrical=False,
        related_name='organization_members'
    )
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def save(self, *args, **kwargs):
        # Set organization creation time on first save
        if self.organization_name and not self.organization_created_at:
            self.organization_created_at = timezone.now()
        if self.phone_number:
            normalized = re.sub(r"[^0-9+]", "", self.phone_number)
            if normalized and not normalized.startswith("+"):
                normalized = f"+{normalized}"
            # basic length guard; don't block save, just truncate if wildly long
            if len(normalized) > 20:
                normalized = normalized[:20]
            self.phone_number = normalized
        super().save(*args, **kwargs)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at

    @property
    def is_organization(self):
        """Returns True if this user represents an organization"""
        return bool(self.organization_name)

    def get_organization(self):
        """Get the user's primary organization"""
        if self.is_organization:
            return self
        memberships = self.memberships.select_related('organization').all()
        return memberships[0].organization if memberships else None

class OrganizationMembership(models.Model):
    """
    Represents a user's membership in an organization
    """
    member = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    organization = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='member_memberships',
        limit_choices_to={'organization_name__isnull': False}
    )
    role = models.CharField(
        max_length=20,
        choices=User.ROLE_CHOICES,
        default="viewer"
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('member', 'organization')

    def __str__(self):
        return f"{self.member.username} ({self.role}) - {self.organization.organization_name}"
