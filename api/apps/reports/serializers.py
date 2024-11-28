from rest_framework import serializers
from .models import MonthlyReport


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = [
            "id",
            "employee",
            "month",
            "total_hours_worked",
            "late_minutes",
            "overtime_hours",
            "remaining_leave_days",
        ]
