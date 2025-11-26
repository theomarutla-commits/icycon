from django.db import models
from django.utils import timezone
from django.conf import settings

class SocialAccount(models.Model):
    PLATFORM_CHOICES = [
        ("x", "X / Twitter"),
        ("linkedin", "LinkedIn"),
        ("instagram", "Instagram"),
        ("tiktok", "TikTok"),
        ("youtube", "YouTube"),
        ("reddit", "Reddit"),
        ("discord", "Discord"),
    ]

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name='social_media_socialaccount_set')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    handle = models.CharField(max_length=100)
    oauth_tokens = models.JSONField(default=dict)
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['tenant', 'platform', 'handle']

    def __str__(self):
        return f"{self.handle} ({self.platform})"

class Post(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("scheduled", "Scheduled"),
        ("published", "Published"),
        ("failed", "Failed"),
    ]

    TYPE_CHOICES = [
        ("post", "Social Post"),
        ("article", "Blog Article"),
        ("news", "News Update"),
        ("tutorial", "Tutorial"),
        ("ad", "Advertisement"),
    ]

    CATEGORY_CHOICES = [
        ("general", "General"),
        ("technology", "Technology"),
        ("marketing", "Marketing"),
        ("business", "Business"),
        ("tutorial", "Tutorials"),
        ("announcement", "Announcements"),
    ]

    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name='social_media_post_set')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(blank=True, help_text="Short summary for previews and social sharing")
    post_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="post")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="general")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    featured_image = models.URLField(blank=True, help_text="URL for the post's featured image")
    
    # Social media specific fields
    platforms = models.JSONField(default=list)  # List of platforms to post to
    scheduled_at = models.DateTimeField(blank=True, null=True)
    media_attachments = models.JSONField(default=list, blank=True)
    
    # Ad specific fields
    is_sponsored = models.BooleanField(default=False)
    target_audience = models.JSONField(default=dict, blank=True)
    ad_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # SEO and analytics fields
    tags = models.JSONField(default=list, blank=True)
    meta_description = models.TextField(blank=True)
    seo_keywords = models.JSONField(default=list, blank=True)
    
    # Tracking fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    campaign_id = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Engagement(models.Model):
    """Tracks engagement metrics for posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='engagements')
    platform = models.CharField(max_length=20)
    likes = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    reach = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

class Comment(models.Model):
    """Manages comments on posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class Conversation(models.Model):
    """A conversation between one or more tenants."""
    participants = models.ManyToManyField('tenants.Tenant', related_name='conversations')
    subject = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        parts = ", ".join([p.name for p in self.participants.all()])
        return f"Conversation ({parts})"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='sent_messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['sent_at']

    def __str__(self):
        return f"Message from {self.sender} at {self.sent_at}"
