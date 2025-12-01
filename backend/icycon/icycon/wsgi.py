"""
WSGI config for icycon project.
Ensures the project root is on sys.path so imports work regardless of CWD.
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Add the backend project root to sys.path if missing (use parent of this file)
PROJECT_ROOT = Path(__file__).resolve().parent.parent  # backend/icycon
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'icycon.settings')

application = get_wsgi_application()
