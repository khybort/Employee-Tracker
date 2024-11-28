from django.contrib import admin
from .models import LeaveRequest


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "start_date",
        "end_date",
        "reason",
        "status",
        "created_at",
    )
    list_filter = ("status", "start_date", "end_date")
    search_fields = ("employee__full_name", "reason")
    ordering = ("-created_at",)
