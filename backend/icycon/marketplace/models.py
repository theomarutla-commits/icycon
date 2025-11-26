from django.db import models
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator


class Product(models.Model):
    """Marketplace products or services offered by users/tenants."""
    
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
        ("sold_out", "Sold Out"),
    ]
    
    CATEGORY_CHOICES = [
        ("software", "Software/Apps"),
        ("service", "Services"),
        ("consulting", "Consulting"),
        ("training", "Training & Courses"),
        ("template", "Templates/Code"),
        ("design", "Design Resources"),
        ("marketing", "Marketing Services"),
        ("analytics", "Analytics Tools"),
        ("other", "Other"),
    ]
    
    PRICING_TYPE_CHOICES = [
        ("free", "Free"),
        ("fixed", "Fixed Price"),
        ("subscription", "Subscription"),
        ("custom", "Custom Quote"),
    ]
    
    # Basic info
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="marketplace_products")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_products")
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Listing details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    featured_image = models.URLField(blank=True, help_text="Main product image URL")
    images = models.JSONField(default=list, blank=True, help_text="Additional product images URLs")
    
    # Pricing
    pricing_type = models.CharField(max_length=20, choices=PRICING_TYPE_CHOICES, default="fixed")
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    subscription_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    subscription_interval = models.CharField(max_length=10, choices=[("monthly", "Monthly"), ("yearly", "Yearly")], blank=True)
    
    # Details
    features = models.JSONField(default=list, blank=True, help_text="List of product features/highlights")
    tags = models.JSONField(default=list, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    review_count = models.IntegerField(default=0)
    
    # Availability
    available_quantity = models.IntegerField(null=True, blank=True)
    is_limited_edition = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', 'category']),
            models.Index(fields=['tenant', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.tenant.name}"


class Review(models.Model):
    """Reviews for products."""
    
    RATING_CHOICES = [(i, f"{i} Star{'s' if i != 1 else ''}") for i in range(1, 6)]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    
    rating = models.IntegerField(choices=RATING_CHOICES)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    
    helpful_count = models.IntegerField(default=0)
    verified_purchase = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'reviewer', 'tenant']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating}★ - {self.title}"


class Order(models.Model):
    """Orders placed for products."""
    
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    ]
    
    order_number = models.CharField(max_length=50, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")
    buyer_tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="marketplace_purchases")
    buyer_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="purchased_products")
    
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    
    # Customer info
    customer_email = models.EmailField()
    customer_message = models.TextField(blank=True)
    
    # Payment info (basic tracking)
    payment_method = models.CharField(max_length=50, blank=True)
    payment_status = models.CharField(max_length=20, choices=[("pending", "Pending"), ("completed", "Completed"), ("failed", "Failed")], default="pending")
    
    # Delivery/Access
    access_token = models.CharField(max_length=100, unique=True, null=True, blank=True, help_text="Token for accessing digital product")
    delivery_details = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['buyer_tenant', 'status']),
            models.Index(fields=['product', 'status']),
        ]
    
    def __str__(self):
        return f"Order {self.order_number}"


class SavedProduct(models.Model):
    """Bookmarks/saved products for users."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_products")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="saved_by_users")
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-saved_at']
    
    def __str__(self):
        return f"{self.user.username} saved {self.product.title}"


class Conversation(models.Model):
    """Conversations between buyer and seller."""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="conversations")
    buyer_tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="buyer_conversations")
    seller_tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="seller_conversations")
    
    subject = models.CharField(max_length=200, default="Product Inquiry")
    status = models.CharField(max_length=20, choices=[
        ("open", "Open"),
        ("closed", "Closed"),
        ("resolved", "Resolved"),
    ], default="open")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'buyer_tenant', 'seller_tenant']
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Conversation on {self.product.title}"


class Message(models.Model):
    """Messages in marketplace conversations."""
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="marketplace_messages")
    
    content = models.TextField()
    attachments = models.JSONField(default=list, blank=True)
    
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} at {self.created_at}"
