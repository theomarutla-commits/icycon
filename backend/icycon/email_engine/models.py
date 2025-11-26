from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone

class EmailList(models.Model):
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    lawful_basis = models.CharField(max_length=100, help_text="consent / legitimate_interest / contract")
    region = models.CharField(max_length=50, blank=True)
    segment_sql = models.TextField(blank=True, help_text="Optional SQL or filter expression describing the segment")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class Contact(models.Model):
    email = models.EmailField()
    name = models.CharField(max_length=200, blank=True)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    subscribed = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(default=timezone.now)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    properties = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("email", "tenant")

    def __str__(self):
        return self.email


class EmailTemplate(models.Model):
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    subject = models.CharField(max_length=300)
    body_html = models.TextField()
    body_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class EmailFlow(models.Model):
    """
    A simple representation of a flow (e.g. Welcome, Activation, Nurture).
    For full workflow logic you'd expand this into steps & conditions.
    """
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class EmailSend(models.Model):
    """
    Records each queued/sent email for attribution & complaints tracking.
    """
    email_list = models.ForeignKey(EmailList, on_delete=models.SET_NULL, null=True, blank=True)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    recipient = models.ForeignKey(Contact, on_delete=models.CASCADE)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default="queued")  # queued, sent, bounced, complaint, dropped
    message_id = models.CharField(max_length=300, blank=True)
    bounces = models.IntegerField(default=0)
    complaints = models.IntegerField(default=0)
    revenue_attributed = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    last_error = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.email} - {self.status}"
