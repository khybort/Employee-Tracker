from celery import shared_task
from channels.layers import get_channel_layer
from celery.utils.log import get_task_logger
from asgiref.sync import async_to_sync
from .models import Notification
from apps.employees.models import Employee


celery_logger = get_task_logger(__name__)


@shared_task
def notify_late_employee(employee_id, late_minutes):
    celery_logger.info("Notify Late Employee Task Started...")
    channel_layer = get_channel_layer()
    managers = Employee.objects.filter(is_manager=True)

    message = f"{late_minutes} dakika geç kalan çalışan ID: {employee_id}"
    celery_logger.info(f"Message: {message}")
    for manager in managers:
        Notification.objects.create(user=manager, message=message)
        celery_logger.info(f"Group send for user_{manager.id} started")
        async_to_sync(channel_layer.group_send)(
            f"user_{manager.id}",
            {
                "type": "send_notification",
                "message": {"message": message},
            },
        )
        celery_logger.info(f"Group send for user_{manager.id} finished")


@shared_task
def daily_attendance_check():
    from apps.attendance.models import AttendanceRecord
    from datetime import datetime

    celery_logger.info("Daily Attendance Check Periodic Task Started...")

    employees = Employee.objects.all()
    for employee in employees:
        attendance = AttendanceRecord.objects.filter(
            employee=employee, date=datetime.now().date()
        ).first()
        if not attendance or not attendance.check_out_time:
            managers = Employee.objects.filter(is_manager=True)
            for manager in managers:
                message = (
                    f"Employee {employee.full_name} did not complete check-out today."
                )
                celery_logger.info(f"Message: {message}")
                Notification.objects.create(user=manager, message=message)
