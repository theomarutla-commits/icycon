from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model

from ..models import EmailTemplate, EmailSend, Contact, EmailList
from .delivery_providers import send_via_provider

User = get_user_model()


def send_account_created_notifications(tenant, user):
    """Send notifications to the newly created user and to site admins/superusers.

    This function will:
    - Ensure a contact exists for the user under the tenant.
    - Create simple EmailTemplate objects (if missing) for user and admin notifications.
    - Create EmailSend records and invoke the delivery provider (mock in dev).
    """
    # Ensure contact for user
    contact, _ = Contact.objects.get_or_create(email=user.email, tenant=tenant, defaults={
        'name': f"{user.first_name} {user.last_name}".strip()
    })

    # Prepare user-facing template
    user_template, _ = EmailTemplate.objects.get_or_create(
        tenant=tenant,
        name='Account Created - User',
        defaults={
            'subject': 'Welcome to Icycon — account created',
            'body_html': f"<p>Hi {user.first_name or user.username},</p><p>Your account for {tenant.name} has been created. You can log in at <a href='/'>{settings.SITE_NAME if hasattr(settings, 'SITE_NAME') else 'Icycon'}</a>.</p>",
            'body_text': f"Hi {user.first_name or user.username},\nYour account for {tenant.name} has been created. Visit the site to log in.",
        }
    )

    # Create EmailSend for user
    send_user = EmailSend.objects.create(
        template=user_template,
        recipient=contact,
        tenant=tenant,
        status='queued',
    )

    # Attempt to send (delivery provider is a dry-run in this project)
    try:
        ok, message_id, error = send_via_provider(send_user)
        if ok:
            send_user.status = 'sent'
            send_user.sent_at = timezone.now()
            send_user.message_id = message_id or ''
        else:
            send_user.status = 'failed'
            send_user.last_error = error or 'unknown error'
        send_user.save()
    except Exception as exc:
        send_user.status = 'failed'
        send_user.last_error = str(exc)
        send_user.save()

    # Notify admins: use settings.ADMINS if present, else superusers
    admin_emails = [email for _, email in getattr(settings, 'ADMINS', [])]
    if not admin_emails:
        admin_qs = User.objects.filter(is_superuser=True).exclude(email='')
        admin_emails = list(admin_qs.values_list('email', flat=True))

    for admin_email in admin_emails:
        admin_contact, _ = Contact.objects.get_or_create(email=admin_email, tenant=tenant, defaults={'name': 'Admin'})

        admin_template, _ = EmailTemplate.objects.get_or_create(
            tenant=tenant,
            name='Account Created - Admin',
            defaults={
                'subject': f'New tenant signup: {tenant.name}',
                'body_html': f"<p>Admin,</p><p>A new tenant <strong>{tenant.name}</strong> was created by {user.email}.</p>",
                'body_text': f"A new tenant {tenant.name} was created by {user.email}.",
            }
        )

        send_admin = EmailSend.objects.create(
            template=admin_template,
            recipient=admin_contact,
            tenant=tenant,
            status='queued',
        )

        try:
            ok, message_id, error = send_via_provider(send_admin)
            if ok:
                send_admin.status = 'sent'
                send_admin.sent_at = timezone.now()
                send_admin.message_id = message_id or ''
            else:
                send_admin.status = 'failed'
                send_admin.last_error = error or 'unknown error'
            send_admin.save()
        except Exception as exc:
            send_admin.status = 'failed'
            send_admin.last_error = str(exc)
            send_admin.save()

    return True
