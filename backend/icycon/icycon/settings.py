import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Helper to safely parse comma-separated env vars (handles None values)
def env_list(name, default=""):
    raw = os.getenv(name)
    if raw is None:
        raw = default
    if not isinstance(raw, str):
        raw = str(raw)
    return [item.strip() for item in raw.split(",") if isinstance(item, str) and item.strip()]

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-your-secret-key-here')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Parse ALLOWED_HOSTS, default to localhost for development
ALLOWED_HOSTS = env_list('ALLOWED_HOSTS', '127.0.0.1,localhost')

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

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
# if os.getenv('DATABASE_URL'):
#     import dj_database_url
#     DATABASES = {
#         'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
#     }
# else:
DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

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

# CORS settings
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only True in development
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
] + env_list('CORS_ALLOWED_ORIGINS', '')

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1',
    'http://localhost',
] + env_list('CSRF_TRUSTED_ORIGINS', '') + CORS_ALLOWED_ORIGINS

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

# JWT settings (sensible defaults; override via env if needed)
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_MINUTES', 60))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('JWT_REFRESH_DAYS', 7))),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# OpenAI settings
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Email settings
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'no-reply@localhost')
