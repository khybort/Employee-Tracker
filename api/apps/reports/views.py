from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.attendance.models import AttendanceRecord
from apps.employees.models import Employee


class MonthlyWorkReport(APIView):
    def calculate_monthly_hours(self, employee_id, year, month):
        records = AttendanceRecord.objects.filter(
            employee_id=employee_id,
            date__year=year,
            date__month=month,
        )

        total_work_duration = timedelta(0)
        for record in records:
            total_work_duration += record.calculate_work_duration()

        return total_work_duration

    @action(detail=False, methods=["GET"])
    def get(self, request):
        employees = Employee.objects.all()
        employees_response = []
        for employee in employees:
            year = int(request.query_params.get("year", datetime.now().year))
            month = int(request.query_params.get("month", datetime.now().month))

            records = AttendanceRecord.objects.filter(
                employee=employee, date__year=year, date__month=month
            )
            total_work_duration = sum(
                (
                    record.calculate_work_duration().total_seconds()
                    for record in records
                ),
                0,
            )

            total_hours = total_work_duration // 3600
            total_minutes = (total_work_duration % 3600) // 60
            employees_response.append(
                {
                    "employee": employee.full_name,
                    "year": year,
                    "month": month,
                    "total_hours": total_hours,
                    "total_minutes": total_minutes,
                }
            )
        return Response(employees_response)


class EmployeeSummaryView(APIView):
    @action(detail=False, methods=["GET"])
    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            attendance_records = AttendanceRecord.objects.filter(employee=employee)
            total_hours = sum(
                [
                    (record.check_out_time.hour - record.check_in_time.hour)
                    for record in attendance_records
                    if record.check_out_time and record.check_in_time
                ]
            )
            return Response(
                {
                    "employee": employee.full_name,
                    "total_hours": total_hours,
                    "remaining_leave_days": employee.remaining_leave_days,
                }
            )
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
