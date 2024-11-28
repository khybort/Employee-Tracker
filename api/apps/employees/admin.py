from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = [
        "username",
        "full_name",
        "position",
        "is_manager",
        "annual_leave_days",
        "remaining_leave_days",
    ]
    fields = (
        "username",
        "full_name",
        "email",
        "position",
        "is_manager",
        "annual_leave_days",
        "remaining_leave_days",
        "hire_date",
    )
    search_fields = ("username", "full_name", "email")
    readonly_fields = ("annual_leave_days", "remaining_leave_days", "hire_date")
