import os
from celery.schedules import crontab
from decouple import config
from celery import Celery

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    config("DJANGO_SETTINGS_MODULE", "config.settings.development"),
)

app = Celery("config", broker=config("BROKER_URL", default="http://redis:6379"))
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "daily_attendance_check": {
        "task": "apps.notifications.tasks.daily_attendance_check",
        "schedule": crontab(hour=23, minute=59),
    },
}

app.conf.update(
    broker_connection_retry=True,
    broker_connection_max_retries=5,
    broker_connection_retry_on_startup=True,
)
