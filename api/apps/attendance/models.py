from datetime import datetime, timedelta
from django.db import models
from apps.shared.constant import WORK_START_TIME
from apps.employees.models import Employee


class AttendanceRecord(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="attendance_records"
    )
    date = models.DateField(auto_now_add=True)
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    late_duration = models.DurationField(null=True, blank=True)
    overtime = models.DurationField(null=True, blank=True)

    class Meta:
        ordering = ["date"]

    def is_checked_in(self):
        return self.check_in_time is not None

    def is_checked_out(self):
        return self.check_out_time is not None

    def calculate_work_duration(self):
        if self.check_in_time and self.check_out_time:
            check_in_datetime = datetime.combine(self.date, self.check_in_time)
            check_out_datetime = datetime.combine(self.date, self.check_out_time)
            return check_out_datetime - check_in_datetime
        return timedelta(0)

    def calculate_late_duration(self):
        if self.check_in_time and self.check_in_time > WORK_START_TIME:
            late = datetime.combine(self.date, self.check_in_time) - datetime.combine(
                self.date, WORK_START_TIME
            )
            self.late_duration = late

            if self.employee:
                self.employee.deduct_leave_days(hours=late.total_seconds() / 3600)
        else:
            self.late_duration = None
        self.save()

    def __str__(self):
        return f"{self.employee.full_name} - {self.date}"
