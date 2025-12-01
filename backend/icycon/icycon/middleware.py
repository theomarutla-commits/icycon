class ClearCorruptedSessionMiddleware:
    """
    If a stale/invalid session cookie is presented (e.g., after SECRET_KEY change),
    swallow the corruption error and flush the session so the request can proceed.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def _safe_touch(self, request):
        # Touch the session to trigger load; if corrupted, flush it and continue.
        try:
            if hasattr(request, "session"):
                _ = request.session.items()
        except Exception:
            try:
                request.session.flush()
            except Exception:
                pass

    def __call__(self, request):
        self._safe_touch(request)
        try:
            return self.get_response(request)
        except Exception as exc:
            if getattr(request, "_session_retried", False):
                raise
            msg = str(exc)
            # If downstream raises due to bad session, flush once and retry
            if "Session data corrupted" in msg or "session" in msg.lower():
                request._session_retried = True  # type: ignore[attr-defined]
                self._safe_touch(request)
                return self.get_response(request)
            raise
