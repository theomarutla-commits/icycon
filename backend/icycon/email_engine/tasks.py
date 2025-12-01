from celery import shared_task
from django.utils import timezone
from .models import EmailSend, Contact, EmailTemplate, EmailList, SmsMessage
from .services.delivery_providers import send_via_provider
from .services.deliverability import check_spf_dkim_dmarc
from .services.sms_providers import send_sms_via_provider

@shared_task
def queue_email_send_task(email_send_id):
    send = EmailSend.objects.get(id=email_send_id)
    # Check subscription & lawful basis
    if not send.recipient.subscribed:
        send.status = "dropped"
        send.last_error = "Recipient unsubscribed."
        send.save()
        return {"status": "dropped", "reason": "unsubscribed"}

    # Simple provider send
    success, message_id, error = send_via_provider(send)
    if success:
        send.status = "sent"
        send.message_id = message_id
        send.sent_at = timezone.now()
    else:
        send.status = "failed"
        send.last_error = error
    send.save()
    return {"status": send.status, "message_id": message_id, "error": error}

@shared_task
def deliverability_check_task(tenant_id):
    # runs SPF/DKIM/DMARC checks using domain records saved in tenant metadata (placeholder)
    result = check_spf_dkim_dmarc(tenant_id)
    # Ideally save results to a Deliverability model or log them
    return result


@shared_task
def queue_sms_send_task(sms_id):
    sms = SmsMessage.objects.get(id=sms_id)
    ok, message_id, error = send_sms_via_provider(sms)
    if ok:
        sms.status = "sent"
        sms.sent_at = timezone.now()
        sms.provider_message_id = message_id or ""
    else:
        sms.status = "failed"
        sms.last_error = error or "Unknown error"
    sms.save()
    return {"status": sms.status, "message_id": message_id, "error": error}
