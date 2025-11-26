"""
Delivery provider adapter.

This implementation prefers sending via SMTP using Django settings
(`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`,
`EMAIL_USE_TLS`, `EMAIL_USE_SSL`, `DEFAULT_FROM_EMAIL`). If `EMAIL_HOST`
is not configured, it falls back to a dry-run mock (keeps previous behavior).

Returns: (success: bool, message_id: str|None, error: str|None)
"""

from django.conf import settings
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import uuid
import logging

logger = logging.getLogger(__name__)


def _smtp_send(from_addr, to_addr, subject, body_text, body_html=None):
    """Send a single message via SMTP using settings; returns (ok, message_id, error)"""
    host = getattr(settings, 'EMAIL_HOST', None)
    if not host:
        return False, None, 'EMAIL_HOST not configured'

    port = getattr(settings, 'EMAIL_PORT', 25)
    username = getattr(settings, 'EMAIL_HOST_USER', None)
    password = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
    use_tls = getattr(settings, 'EMAIL_USE_TLS', False)
    use_ssl = getattr(settings, 'EMAIL_USE_SSL', False)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr

    if body_text:
        part1 = MIMEText(body_text, 'plain', 'utf-8')
        msg.attach(part1)
    if body_html:
        part2 = MIMEText(body_html, 'html', 'utf-8')
        msg.attach(part2)

    message_id = f"{uuid.uuid4()}"

    try:
        if use_ssl:
            smtp = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            smtp = smtplib.SMTP(host, port, timeout=10)

        smtp.ehlo()
        if use_tls and not use_ssl:
            smtp.starttls()
            smtp.ehlo()

        if username and password:
            smtp.login(username, password)

        smtp.sendmail(from_addr, [to_addr], msg.as_string())
        smtp.quit()
        return True, message_id, None
    except Exception as exc:
        logger.exception('SMTP send failed')
        return False, None, str(exc)


def send_via_provider(email_send):
    """Send using configured provider (SMTP) or fall back to dry-run.

    email_send: EmailSend instance
    Returns: (success: bool, message_id: str|None, error: str|None)
    """
    template = email_send.template
    recipient = email_send.recipient

    from_addr = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@localhost')
    to_addr = recipient.email
    subject = template.subject if template and getattr(template, 'subject', None) else f"Message from {email_send.tenant.name}"
    body_text = getattr(template, 'body_text', '') if template else ''
    body_html = getattr(template, 'body_html', None) if template else None

    # Prefer SMTP if configured
    if getattr(settings, 'EMAIL_HOST', None):
        ok, message_id, error = _smtp_send(from_addr, to_addr, subject, body_text, body_html)
        return ok, message_id, error

    # Fallback dry-run (previous behavior)
    try:
        logger.info(f"[DRY RUN] Sending email to %s using template %s", to_addr, getattr(template, 'name', ''))
        message_id = f"mock-msg-{email_send.id}"
        return True, message_id, None
    except Exception as ex:
        return False, None, str(ex)
