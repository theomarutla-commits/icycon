"""
WSGI config for icycon project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'icycon.settings')

application = get_wsgi_application()