from django.db import models
from tenants.models import Tenant


class App(models.Model):
    """Mobile application for ASO tracking and optimization."""
    PLATFORM_CHOICES = [
        ('ios', 'iOS - Apple App Store'),
        ('android', 'Android - Google Play'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('draft', 'Draft'),
    ]
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='aso_apps')
    name = models.CharField(max_length=255)
    bundle_id = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    developer_name = models.CharField(max_length=255)
    icon_url = models.URLField(blank=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    category = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0, help_text="Current store rating (0-5)")
    reviews_count = models.IntegerField(default=0)
    downloads_count = models.BigIntegerField(default=0)
    last_synced = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = ('tenant', 'bundle_id', 'platform')
    
    def __str__(self):
        return f"{self.name} ({self.get_platform_display()})"


class AppKeyword(models.Model):
    """Keywords targeted for an app in ASO."""
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='keywords')
    keyword = models.CharField(max_length=255)
    position = models.IntegerField(default=0, help_text="Current ranking position in search results")
    search_volume = models.IntegerField(default=0, help_text="Monthly search volume estimate")
    difficulty = models.IntegerField(default=0, help_text="Competition difficulty 0-100")
    tracking = models.BooleanField(default=True)
    added_at = models.DateTimeField(auto_now_add=True)
    last_checked = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('app', 'keyword')
        ordering = ['position']
    
    def __str__(self):
        return f"{self.keyword} - {self.app.name}"


class AppListing(models.Model):
    """App store listing information and history."""
    LOCALE_CHOICES = [
        ('en_US', 'English (US)'),
        ('en_GB', 'English (UK)'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('it', 'Italian'),
        ('ja', 'Japanese'),
        ('zh_CN', 'Chinese (Simplified)'),
        ('pt_BR', 'Portuguese (Brazil)'),
    ]
    
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='listings')
    locale = models.CharField(max_length=20, choices=LOCALE_CHOICES, default='en_US')
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    keywords_string = models.CharField(max_length=500, help_text="Keywords for ASO (comma-separated)")
    promotional_text = models.CharField(max_length=170, blank=True)
    version = models.CharField(max_length=50, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('app', 'locale')
        ordering = ['locale']
    
    def __str__(self):
        return f"{self.app.name} - {self.get_locale_display()}"


class Screenshot(models.Model):
    """App store screenshots for app optimization."""
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='screenshots')
    title = models.CharField(max_length=255, blank=True, help_text="Title for screenshot in specific locale")
    image_url = models.URLField()
    locale = models.CharField(max_length=20, blank=True, help_text="Locale for localized screenshots")
    position = models.IntegerField(default=1, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['position']
    
    def __str__(self):
        return f"Screenshot for {self.app.name}"


class Review(models.Model):
    """App store reviews and ratings."""
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=255)
    rating = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    title = models.CharField(max_length=255, blank=True)
    body = models.TextField()
    helpful_count = models.IntegerField(default=0)
    unhelpful_count = models.IntegerField(default=0)
    response = models.TextField(blank=True, help_text="Developer response to review")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating}★ - {self.app.name}"


class PerformanceMetric(models.Model):
    """Historical performance tracking for apps."""
    METRIC_TYPE_CHOICES = [
        ('rating', 'Rating'),
        ('reviews', 'Review Count'),
        ('downloads', 'Downloads'),
        ('rank', 'Store Rank'),
        ('impressions', 'Impressions'),
        ('installs', 'Installs'),
    ]
    
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='performance_metrics')
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPE_CHOICES)
    value = models.FloatField()
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('app', 'metric_type', 'date')
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.app.name} - {self.get_metric_type_display()} on {self.date}"


class CompetitorApp(models.Model):
    """Track competitor apps for comparison and competitive analysis."""
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='competitors')
    competitor_name = models.CharField(max_length=255)
    competitor_bundle_id = models.CharField(max_length=255)
    platform = models.CharField(max_length=20, choices=App.PLATFORM_CHOICES)
    rating = models.FloatField(default=0)
    reviews_count = models.IntegerField(default=0)
    downloads_count = models.BigIntegerField(default=0)
    category = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    last_checked = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('app', 'competitor_bundle_id')
        ordering = ['-rating']
    
    def __str__(self):
        return f"{self.competitor_name} (competitor to {self.app.name})"


class OptimizationTask(models.Model):
    """Track ASO optimization tasks and recommendations."""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='optimization_tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    category = models.CharField(max_length=100, blank=True)
    estimated_impact = models.CharField(max_length=100, blank=True, help_text="e.g., +5% downloads")
    due_date = models.DateField(null=True, blank=True)
    assigned_to = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', 'due_date']
    
    def __str__(self):
        return f"{self.title} - {self.app.name}"
