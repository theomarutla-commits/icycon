import os
from pathlib import Path
from datetime import timedelta

try:
    import dj_database_url
except ImportError:  # optional dep; skip if not installed
    dj_database_url = None


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

def env_list(name, default=None):
    """
    Parse comma-separated env vars into a list, trimming whitespace/trailing slashes.
    Keeps local-friendly defaults when not provided.
    """
    raw = os.getenv(name)
    if not raw:
        return default or []
    return [item.strip().rstrip("/") for item in raw.split(",") if item.strip()]

def with_https_variants(origins):
    """Ensure https variants exist for any http origins."""
    https_variants = []
    for origin in origins or []:
        if origin.startswith("http://"):
            https_variants.append("https://" + origin.split("://", 1)[1])
    # Preserve order while deduping
    return list(dict.fromkeys((origins or []) + https_variants))

# ---------------------------------------------------------------------------
# Manual settings with environment variable overrides
# ---------------------------------------------------------------------------
# Values can be configured via environment variables for production safety.
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-me')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'  # Set to False in production
default_allowed_hosts = ['127.0.0.1', 'localhost']
# Allow Render to inject its hostname automatically, while still letting env override.
render_host = os.getenv("RENDER_EXTERNAL_HOSTNAME")
if render_host:
    default_allowed_hosts.append(render_host)
ALLOWED_HOSTS = env_list('ALLOWED_HOSTS', default_allowed_hosts)

# CORS / CSRF (manually managed)
CORS_ALLOW_ALL_ORIGINS = False  # avoid '*' because we send credentials
CORS_ALLOW_CREDENTIALS = True
default_frontend_origins = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:4173',
    'http://localhost:4173',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
]
frontend_env_origins = env_list('CORS_ALLOWED_ORIGINS')
frontend_single_url = os.getenv('FRONTEND_URL')
if frontend_single_url:
    frontend_env_origins = (frontend_env_origins or []) + [frontend_single_url]
CORS_ALLOWED_ORIGINS = frontend_env_origins or default_frontend_origins

# Keep CSRF in sync with CORS unless explicitly overridden
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS')
if not CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS = with_https_variants(CORS_ALLOWED_ORIGINS)


# OpenAI (env only; never hardcode secrets)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

#Email settings 
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@example.com')
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'



# Database options (manual)
# Default remains SQLite. A Postgres connection is defined for optional use.


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'analytics.apps.AnalyticsConfig',
    'aso.apps.AsoConfig',
    'marketplace.apps.MarketplaceConfig',
    'multilingual.apps.MultilingualConfig',
    'seo.apps.SeoConfig',
    'users.apps.UsersConfig',
    'email_engine.apps.EmailEngineConfig',
    'social_media.apps.SocialMediaConfig',
    'tenants.apps.TenantsConfig',
    'chatbot.apps.ChatbotConfig',
    'icycon',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoise middleware serves static files in production without NGINX
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'icycon.middleware.ClearCorruptedSessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'icycon.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'icycon.wsgi.application'

# Database: explicit Postgres URL; fallback to local SQLite if parsing fails or dependency missing
DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_SSL_REQUIRED = os.getenv("DATABASE_SSL_REQUIRED", "True").lower() == "true"

default_sqlite = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": BASE_DIR / "db.sqlite3",
}

if DATABASE_URL and dj_database_url:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=DATABASE_SSL_REQUIRED,
        )
    }
else:
    DATABASES = {"default": default_sqlite}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static"
]
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

# Authentication settings
LOGIN_REDIRECT_URL = '/'  # Redirect to home page after login
LOGOUT_REDIRECT_URL = '/'  # Redirect to home page after logout
LOGIN_URL = '/login/'  # URL to redirect to when login is required
# Rotate session cookie name to avoid stale/corrupted cookies from prior keys/deploys
SESSION_COOKIE_NAME = os.getenv('SESSION_COOKIE_NAME', 'icycon_sessionid')

# CORS / CSRF settings (manually managed above)

# In development, use cookie-based CSRF and allow from all origins if DEBUG is True
if DEBUG:
    CSRF_COOKIE_SECURE = False
    CSRF_COOKIE_HTTPONLY = False
    SESSION_COOKIE_SECURE = False

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',  # Fallback for admin
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT lifetimes (manual)
JWT_ACCESS_MINUTES = 60
JWT_REFRESH_DAYS = 7


# JWT settings (manual defaults)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=JWT_ACCESS_MINUTES),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=JWT_REFRESH_DAYS),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
