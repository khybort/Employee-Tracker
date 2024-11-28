from .base import *

DEBUG = True

INSTALLED_APPS += ["debug_toolbar"]

MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

INTERNAL_IPS = ["127.0.0.1"]

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="*", cast=lambda v: v.split(","))
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", default="*", cast=lambda v: v.split(",")
)
