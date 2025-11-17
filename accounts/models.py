from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save


class SocialMediaProfile(models.Model):
    PLATFORM_CHOICES = [
        ('twitter', 'Twitter'),
        ('linkedin', 'LinkedIn'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('youtube', 'YouTube'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='social_profiles',
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    handle = models.CharField(max_length=100)
    url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'platform', 'handle')
        ordering = ['-updated_at']

    def __str__(self) -> str:
        return f'{self.user.username} – {self.platform} / {self.handle}'


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)

    def __str__(self) -> str:
        return f'Profile for {self.user.username}'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_profile_exists(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'profile'):
        Profile.objects.create(user=instance)


class SocialMediaPost(models.Model):
    profile = models.ForeignKey(
        SocialMediaProfile,
        on_delete=models.CASCADE,
        related_name='posts',
    )
    caption = models.CharField(max_length=280)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    posted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_at', '-created_at']

    def __str__(self) -> str:
        return f'{self.profile} → {self.caption[:20]}'
