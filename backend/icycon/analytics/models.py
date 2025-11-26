from django.db import models

class Site(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    domain = models.URLField()
    sitemaps_url = models.URLField(blank=True)
    default_locale = models.CharField(max_length=10, default='en')
    robots_txt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.domain


class KeywordCluster(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
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

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
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
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    source_urls = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

# Analytics specific models
class PageView(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    url = models.URLField()
    visitor_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField(default=0)  # Duration in seconds
    bounce = models.BooleanField(default=True)
    referrer = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.url} ({self.timestamp})"