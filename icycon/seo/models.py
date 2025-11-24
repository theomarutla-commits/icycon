from django.db import models

# Create your models here.
from django.db import models

class Site(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='seo_sites')
    domain = models.URLField()
    sitemaps_url = models.URLField(blank=True)
    default_locale = models.CharField(max_length=10, default='en')
    robots_txt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'domain')

    def __str__(self):
        return f"{self.domain} ({self.tenant.name})"


class KeywordCluster(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='seo_keyword_clusters')
    locale = models.CharField(max_length=10, default='en')
    intent = models.CharField(max_length=100)
    terms = models.JSONField(default=list)  # list of keywords
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.intent} ({self.locale})"


class ContentItem(models.Model):
    TYPE_CHOICES = [
        ("blog", "Blog Post"),
        ("faq", "FAQ Page"),
        ("qapage", "Q&A Page"),
        ("product", "Product Page"),
    ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='seo_content_items')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    url = models.URLField()
    status = models.CharField(max_length=20, default="draft")
    locale = models.CharField(max_length=10, default='en')
    brief_json = models.JSONField(default=dict)
    draft_html = models.TextField(blank=True)
    json_ld = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type}: {self.url}"


class FAQ(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='seo_faqs')
    question = models.CharField(max_length=255)
    answer = models.TextField()
    source_urls = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


# ============ BACKLINKS MODELS ============

class Backlink(models.Model):
    """External backlinks pointing to your site."""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('lost', 'Lost'),
        ('broken', 'Broken'),
        ('spam', 'Spam'),
    ]
    
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='backlinks')
    source_url = models.URLField()
    target_url = models.URLField()
    anchor_text = models.CharField(max_length=255, blank=True)
    domain_rating = models.IntegerField(default=0, help_text="0-100 scale")
    page_authority = models.IntegerField(default=0, help_text="0-100 scale")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_dofollow = models.BooleanField(default=True)
    is_external = models.BooleanField(default=True)
    first_seen = models.DateTimeField(auto_now_add=True)
    last_checked = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('site', 'source_url', 'target_url')
        ordering = ['-domain_rating', '-last_checked']
        indexes = [
            models.Index(fields=['site', 'status']),
            models.Index(fields=['site', 'domain_rating']),
        ]
    
    def __str__(self):
        return f"{self.source_url} -> {self.target_url}"


class BacklinkProfile(models.Model):
    """Summary profile of all backlinks for a site."""
    site = models.OneToOneField(Site, on_delete=models.CASCADE, related_name='backlink_profile')
    total_backlinks = models.IntegerField(default=0)
    unique_domains = models.IntegerField(default=0)
    avg_domain_rating = models.FloatField(default=0)
    dofollow_backlinks = models.IntegerField(default=0)
    nofollow_backlinks = models.IntegerField(default=0)
    toxic_backlinks_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile: {self.site.domain}"


class CompetitorBacklink(models.Model):
    """Track backlinks of competing websites for benchmarking."""
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='competitor_backlinks')
    competitor_domain = models.URLField()
    source_url = models.URLField()
    target_url = models.URLField()
    anchor_text = models.CharField(max_length=255, blank=True)
    domain_rating = models.IntegerField(default=0)
    page_authority = models.IntegerField(default=0)
    is_dofollow = models.BooleanField(default=True)
    last_checked = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('site', 'source_url', 'target_url')
        ordering = ['-domain_rating']
    
    def __str__(self):
        return f"Competitor link: {self.source_url}"


class LinkOpportunity(models.Model):
    """Potential websites for link outreach and acquisition."""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('contacted', 'Contacted'),
        ('negotiating', 'Negotiating'),
        ('failed', 'Failed'),
        ('secured', 'Secured'),
    ]
    
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='link_opportunities')
    prospect_url = models.URLField()
    prospect_domain = models.CharField(max_length=255)
    anchor_text = models.CharField(max_length=255)
    target_page = models.URLField()
    domain_rating = models.IntegerField(default=0)
    page_authority = models.IntegerField(default=0)
    traffic_estimate = models.IntegerField(default=0)
    relevance_score = models.IntegerField(default=0, help_text="0-100 score")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    contact_email = models.EmailField(blank=True)
    contact_name = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    outreach_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', '-relevance_score']
        indexes = [
            models.Index(fields=['site', 'status']),
            models.Index(fields=['site', 'priority']),
        ]
    
    def __str__(self):
        return f"Opportunity: {self.prospect_domain}"
