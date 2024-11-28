from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

from apps.shared.constant import CHECK_IN, CHECK_OUT, WORK_TIME
from apps.shared.logger import logger


class Employee(AbstractUser):
    full_name = models.CharField(max_length=255, verbose_name="Full Name")
    position = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Position"
    )
    hire_date = models.DateField(default=now, verbose_name="Hire Date")
    annual_leave_days = models.FloatField(
        default=15.0, verbose_name="Annual Leave Days"
    )
    remaining_leave_days = models.FloatField(
        default=15.0, verbose_name="Remaining Leave Days"
    )
    is_manager = models.BooleanField(default=False, verbose_name="Is Manager")

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    def __str__(self):
        return f"{self.username} ({self.full_name})"

    def record_attendance(self, date, time_type, current_time):
        from apps.attendance.models import AttendanceRecord

        record, created = AttendanceRecord.objects.get_or_create(
            employee=self, date=date
        )
        if time_type == CHECK_IN:
            if record.check_in_time:
                logger.error("Check-in already recorded")
                raise ValueError("Check-in already recorded.")
            record.check_in_time = current_time
        elif time_type == CHECK_OUT:
            if record.check_out_time:
                logger.error("Check-out already recorded")
                raise ValueError("Check-out already recorded.")
            record.check_out_time = current_time
        record.calculate_late_duration()

        if time_type == CHECK_IN and record.late_duration.total_seconds() > 0:
            from apps.notifications.tasks import notify_late_employee

            logger.info(f"Late employee: {record.late_duration.total_seconds() // 60}")
            notify_late_employee.delay(
                self.id, record.late_duration.total_seconds() // 60
            )
        record.save()
        return record

    def deduct_leave_days(self, hours):
        days_to_deduct = hours / WORK_TIME
        if self.remaining_leave_days >= days_to_deduct:
            self.remaining_leave_days -= days_to_deduct
        else:
            logger.error("Not enough leave days available")
            raise ValueError("Not enough leave days available.")
        self.save()
