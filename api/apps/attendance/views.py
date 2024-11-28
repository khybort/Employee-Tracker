from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.schemas.openapi import AutoSchema
from rest_framework.pagination import PageNumberPagination
from django.utils.timezone import now
from .models import AttendanceRecord
from .serializers import AttendanceSerializer
from apps.shared.models import Holiday
from apps.shared.utils import get_employee
from apps.shared.logger import logger


class CustomPagination(PageNumberPagination):
    page_size_query_param = "pageSize"


class AttendanceViewSet(ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    schema = AutoSchema()

    def get_queryset(self, request):
        employee = get_employee(request)
        if not employee.is_authenticated:
            logger.error("User is not authenticated.")
            raise ValueError("User is not authenticated.")
        if employee.is_manager:
            return AttendanceRecord.objects.all()
        return AttendanceRecord.objects.filter(employee=employee)

    @action(detail=False, methods=["GET"])
    def list(self, request):
        queryset = self.get_queryset(request)
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = AttendanceSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["post"])
    def record_attendance(self, request):
        try:
            employee = get_employee(request)

            time_type = request.data.get("type")
            current_time = now().time()
            date = now().date()

            if Holiday.objects.filter(date=date).exists():
                logger.error("The day you are trying to log in is a holiday.")
                return Response(
                    {"error": "The day you are trying to log in is a holiday."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if date.weekday() >= 5:  # 5 = Cumartesi, 6 = Pazar
                logger.error("You cannot log in on the weekend.")
                return Response(
                    {"error": "You cannot log in on the weekend."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            record = employee.record_attendance(
                date=date, time_type=time_type, current_time=current_time
            )
            return Response(AttendanceSerializer(record).data)
        except ValueError as e:
            logger.error("Error: %s" % e)
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            logger.error("Error: %s" % e)
            return Response({"error": "An unexpected error occurred."}, status=500)

    @action(detail=False, methods=["get"])
    def get_summary(self, request):
        employee = get_employee(request)
        today = now().date()

        try:
            record = AttendanceRecord.objects.get(employee=employee, date=today)
            return Response(
                {
                    "isCheckedIn": record.is_checked_in(),
                    "isCheckedOut": record.is_checked_out(),
                    "lateMinutes": record.late_duration.total_seconds() // 60
                    if record.late_duration
                    else 0,
                    "remainingLeaves": employee.remaining_leave_days,
                    "message": "Your current situation has been brought successfully.",
                }
            )
        except AttendanceRecord.DoesNotExist:
            logger.info("AttendanceRecord does not exist")
            return Response(
                {
                    "isCheckedIn": False,
                    "isCheckedOut": False,
                    "lateMinutes": None,
                    "remainingLeaves": employee.remaining_leave_days,
                    "message": "No records found yet for today.",
                }
            )
