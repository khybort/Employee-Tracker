from django.contrib import admin
from .models import AttendanceRecord


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "date",
        "check_in_time",
        "check_out_time",
        "late_duration",
        "overtime",
    )
    search_fields = ("employee__full_name", "date")
