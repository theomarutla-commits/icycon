from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Manual settings (no environment variable lookup)
# ---------------------------------------------------------------------------
# Update these values directly to fit your deployment.
SECRET_KEY = 'django-insecure-change-me'
DEBUG = True  # Set to False in production
ALLOWED_HOSTS = ['127.0.0.1', 'localhost','*']

# CORS / CSRF (manually managed)
CORS_ALLOW_ALL_ORIGINS = False  # avoid '*' because we send credentials
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
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
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:4173',
    'http://localhost:4173',
]

# JWT lifetimes (manual)
JWT_ACCESS_MINUTES = 60
JWT_REFRESH_DAYS = 7

#  OpenAI (manual)
OPENAI_API_KEY = '' # paste your key if used

#Email settings 
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'theosknowledge@gmail.com'
EMAIL_HOST_PASSWORD = 'qbou ikyx crnt mody'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'theosknowledge@gmail.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'theosknowledge@gmail.com'
# EMAIL_HOST_PASSWORD = 'qbou ikyx crnt mody '  # You'll need to set this to your Gmail app password
# EMAIL_USE_TLS = True
# DEFAULT_FROM_EMAIL = 'theosknowledge@gmail.com'

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
# Default uses SQLite for easy local dev. A Postgres connection is also defined;
# set USE_POSTGRES_AS_DEFAULT to True if your Postgres instance is running.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
USE_POSTGRES_AS_DEFAULT = False  # toggle to True only when Postgres is up
POSTGRES = {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': 'icycon',
    'USER': 'icy',
    'PASSWORD': 'IpE6ksNJL2pqnB96kxLAWE9ZiUdNBzZx',
    'HOST': 'dpg-d4euuargk3sc73c06940-a',
    'PORT': '5432',
}

if USE_POSTGRES_AS_DEFAULT:
    DATABASES = {
        'default': POSTGRES,
        'sqlite': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        },
    }
else:
    DATABASES['postgres'] = POSTGRES

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

# JWT settings (manual defaults)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=JWT_ACCESS_MINUTES),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=JWT_REFRESH_DAYS),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
