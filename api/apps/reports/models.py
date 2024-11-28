from django.db import models
from apps.employees.models import Employee


class MonthlyReport(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="monthly_reports"
    )
    month = models.DateField()
    total_hours_worked = models.FloatField()
    late_minutes = models.IntegerField(default=0)
    overtime_hours = models.FloatField(default=0.0)
    remaining_leave_days = models.FloatField()

    def __str__(self):
        return f"Report for {self.employee.full_name} - {self.month.strftime('%B %Y')}"
