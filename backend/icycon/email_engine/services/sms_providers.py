"""
SMS provider adapter.

Prefers Twilio if environment variables are set:
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.
Falls back to a dry-run stub when not configured.

Returns: (success: bool, message_id: str|None, error: str|None)
"""

import logging
from typing import Tuple
import uuid
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_sms_via_provider(sms_message) -> Tuple[bool, str, str]:
    account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None)
    auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", None)
    from_number = getattr(settings, "TWILIO_FROM_NUMBER", None)

    to_number = sms_message.to_number
    body = sms_message.body

    if account_sid and auth_token and from_number:
        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
        data = {"From": from_number, "To": to_number, "Body": body}
        try:
            resp = requests.post(url, data=data, auth=(account_sid, auth_token), timeout=10)
            if resp.status_code in (200, 201):
                message_id = resp.json().get("sid") or str(uuid.uuid4())
                return True, message_id, None
            return False, None, f"Twilio error: {resp.status_code} {resp.text}"
        except Exception as exc:
            logger.exception("Twilio SMS send failed")
            return False, None, str(exc)

    # Dry-run fallback
    logger.info("[DRY RUN] SMS to %s: %s", to_number, body)
    return True, f"mock-sms-{uuid.uuid4()}", None
