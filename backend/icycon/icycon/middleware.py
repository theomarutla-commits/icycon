class ClearCorruptedSessionMiddleware:
    """
    If a stale/invalid session cookie is presented (e.g., after SECRET_KEY change),
    swallow the corruption error and flush the session so the request can proceed.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Touch the session to trigger load; if corrupted, flush it and continue.
        try:
            if hasattr(request, "session"):
                _ = request.session.items()
        except Exception:
            try:
                request.session.flush()
            except Exception:
                pass
        return self.get_response(request)
