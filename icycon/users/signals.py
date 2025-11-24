"""Signal handlers for user operations."""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

User = get_user_model()

try:
    from email_engine.models import EmailTemplate, EmailSend, Contact
    from tenants.models import Tenant
    from email_engine.services.delivery_providers import send_via_provider
    EMAIL_AVAILABLE = True
except ImportError:
    EMAIL_AVAILABLE = False


@receiver(post_save, sender=User)
def send_welcome_email_on_user_created(sender, instance, created, **kwargs):
    """
    Send a welcome email to newly created users.
    
    This signal is triggered after a new User object is saved.
    We only act if the user was just created (created=True) and has an email.
    """
    if not created or not instance.email or not EMAIL_AVAILABLE:
        return
    
    try:
        # Get or create default tenant for this user (if no tenant exists yet)
        # This ensures the user can receive emails tied to their first tenant
        tenant = Tenant.objects.filter(tenantuser__user=instance).first()
        
        if not tenant:
            # Create a default personal tenant if user has no tenant yet
            tenant = Tenant.objects.create(
                name=f"{instance.username}'s Workspace",
                region="US",
                plan="free"
            )
            from tenants.models import TenantUser
            TenantUser.objects.create(user=instance, tenant=tenant, role='owner')
        
        # Get or create contact
        contact, _ = Contact.objects.get_or_create(
            email=instance.email,
            tenant=tenant,
            defaults={'name': f"{instance.first_name} {instance.last_name}".strip() or instance.username}
        )
        
        # Create welcome template
        welcome_template, _ = EmailTemplate.objects.get_or_create(
            tenant=tenant,
            name='Welcome Email - New User',
            defaults={
                'subject': f'Welcome to {settings.SITE_NAME if hasattr(settings, "SITE_NAME") else "Icycon"}!',
                'body_html': f"""
                    <p>Hi {instance.first_name or instance.username},</p>
                    <p>Welcome to {settings.SITE_NAME if hasattr(settings, "SITE_NAME") else "Icycon"}! Your account has been created successfully.</p>
                    <p>You can now log in and start exploring all the features available to you.</p>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Happy exploring!</p>
                """,
                'body_text': f"""
                    Hi {instance.first_name or instance.username},
                    
                    Welcome to {settings.SITE_NAME if hasattr(settings, "SITE_NAME") else "Icycon"}! Your account has been created successfully.
                    
                    You can now log in and start exploring all the features available to you.
                    
                    If you have any questions, feel free to reach out to our support team.
                    
                    Happy exploring!
                """,
            }
        )
        
        # Create email send record
        send_record = EmailSend.objects.create(
            template=welcome_template,
            recipient=contact,
            tenant=tenant,
            status='queued',
        )
        
        # Attempt to send via provider
        try:
            ok, message_id, error = send_via_provider(send_record)
            if ok:
                send_record.status = 'sent'
                send_record.sent_at = timezone.now()
                send_record.message_id = message_id or ''
            else:
                send_record.status = 'failed'
                send_record.last_error = error or 'unknown error'
            send_record.save()
        except Exception as exc:
            send_record.status = 'failed'
            send_record.last_error = str(exc)
            send_record.save()
    
    except Exception as e:
        # Log but don't fail user creation if email send fails
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send welcome email to {instance.email}: {str(e)}")
