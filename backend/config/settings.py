import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-local-dev-only-change-before-deploy",
)

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,.vercel.app").split(",")
    if h.strip()
]

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS", "http://localhost:5173,https://*.vercel.app"
    ).split(",")
    if origin.strip()
]

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

# IMPORTANT: "unfold" MUST appear before "django.contrib.admin"
INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "axes",
    "storages",
    "portfolio",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "axes.middleware.AxesMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Authentication Backends (Django Axes lockout protection)
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]

AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1  # Hours
AXES_RESET_ON_SUCCESS = True

# Database: Supabase Pooler (transaction mode) in production, SQLite fallback locally
USE_DIRECT_DB = os.getenv("USE_DIRECT_DB", "False").lower() == "true"
DB_URL = (
    os.getenv("DIRECT_DATABASE_URL", "").strip()
    if USE_DIRECT_DB and os.getenv("DIRECT_DATABASE_URL", "").strip()
    else os.getenv("DATABASE_URL", "").strip()
)

if DB_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DB_URL,
            conn_max_age=0,
            ssl_require=True,
        )
    }
    if not USE_DIRECT_DB:
        DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Cache for django-ratelimit (silence local cache check warning cleanly)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "portfolio-ratelimit-cache",
    }
}
SILENCED_SYSTEM_CHECKS = ["django_ratelimit.E003", "django_ratelimit.W001"]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Karachi"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Storage: Supabase S3 when credentials exist, local filesystem otherwise
SUPABASE_S3_ENDPOINT = os.getenv("SUPABASE_S3_ENDPOINT", "").strip()
SUPABASE_S3_ACCESS_KEY = os.getenv("SUPABASE_S3_ACCESS_KEY", "").strip()
SUPABASE_S3_SECRET_KEY = os.getenv("SUPABASE_S3_SECRET_KEY", "").strip()
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "").strip()
SUPABASE_S3_REGION = os.getenv("SUPABASE_S3_REGION", "us-east-1").strip()
SUPABASE_PUBLIC_DOMAIN = os.getenv("SUPABASE_PUBLIC_DOMAIN", "").strip()

if all([SUPABASE_S3_ENDPOINT, SUPABASE_S3_ACCESS_KEY, SUPABASE_S3_SECRET_KEY, SUPABASE_BUCKET]):
    s3_options = {
        "bucket_name": SUPABASE_BUCKET,
        "endpoint_url": SUPABASE_S3_ENDPOINT,
        "access_key": SUPABASE_S3_ACCESS_KEY,
        "secret_key": SUPABASE_S3_SECRET_KEY,
        "region_name": SUPABASE_S3_REGION,
        "querystring_auth": False,
        "file_overwrite": False,
        "addressing_style": "path",
    }
    if SUPABASE_PUBLIC_DOMAIN:
        s3_options["custom_domain"] = SUPABASE_PUBLIC_DOMAIN

    DEFAULT_STORAGE_CONFIG = {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": s3_options,
    }
else:
    DEFAULT_STORAGE_CONFIG = {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    }

STORAGES = {
    "default": DEFAULT_STORAGE_CONFIG,
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

WHITENOISE_USE_FINDERS = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Hidden Owner-Only Admin Path
ADMIN_URL_PATH = os.getenv("ADMIN_URL_PATH", "studio-portal-9x2k/").lstrip("/")
if not ADMIN_URL_PATH.endswith("/"):
    ADMIN_URL_PATH += "/"

# Django Unfold Studio Branding
UNFOLD = {
    "SITE_TITLE": "Portfolio v2 Studio",
    "SITE_HEADER": "Portfolio Studio",
    "SITE_SUBHEADER": "Owner CMS",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": False,
    "COLORS": {
        "primary": {
            "50": "253 242 244",
            "100": "252 228 232",
            "200": "249 204 212",
            "300": "244 162 177",
            "400": "235 108 132",
            "500": "224 49 80",
            "600": "179 18 45",
            "700": "142 42 64",
            "800": "107 29 46",
            "900": "76 18 33",
            "950": "42 10 18",
        },
    },
}

# Production HTTPS & Security Headers
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"