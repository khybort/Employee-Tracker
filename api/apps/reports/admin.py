from django.contrib import admin
from .models import MonthlyReport


@admin.register(MonthlyReport)
class MonthlyReportAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "month",
        "total_hours_worked",
        "late_minutes",
        "overtime_hours",
    )
    search_fields = ("employee__full_name", "month")
