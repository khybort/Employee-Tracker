from rest_framework import serializers
from .models import AttendanceRecord


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            "id",
            "employee",
            "employee_name",
            "date",
            "check_in_time",
            "check_out_time",
            "late_duration",
        ]
        read_only_fields = ["late_duration"]
