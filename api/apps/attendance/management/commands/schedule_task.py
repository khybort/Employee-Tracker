from django.core.management.base import BaseCommand
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from apps.shared.constant import DAILY_ATTENDANCE_SCHEDULE_INTERVAL


class Command(BaseCommand):
    help = "Setup periodic tasks"

    def handle(self, *args, **kwargs):
        schedule, created = IntervalSchedule.objects.get_or_create(
            every=DAILY_ATTENDANCE_SCHEDULE_INTERVAL,
            period=IntervalSchedule.DAYS,
        )

        PeriodicTask.objects.get_or_create(
            interval=schedule,
            name="Daily Attendance Check",
            task="apps.attendance.tasks.daily_attendance_check",
        )

        self.stdout.write(self.style.SUCCESS("Periodic tasks created successfully."))
