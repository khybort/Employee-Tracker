from datetime import timedelta, datetime
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from apps.shared.utils import get_employee
from apps.shared.constant import REMAINING_DAY_NOTIFICATION_LIMIT
from apps.shared.logger import logger


class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer

    def get_queryset(self):
        employee = get_employee(self.request)
        if employee.is_manager:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(employee=employee)

    def update_remaining_days(self, leave_request, new_status):
        with transaction.atomic():
            if new_status == LeaveRequest.APPROVED:
                employee = leave_request.employee
                total_days = (
                    leave_request.end_date - leave_request.start_date
                ).days + 1
                if employee.remaining_leave_days < total_days:
                    logger.error("Employee has no remaining leave days")
                    return Response(
                        {"error": "Insufficient leave days."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                employee.remaining_leave_days -= total_days
                employee.save()

    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.filter(id=self.kwargs.get("pk")).first()
        if not obj:
            logger.error("Leave request not found.")
            raise ValueError("Leave request not found.")
        return obj

    def check_weekend(self, start_date, end_date):
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

            requested_dates = [
                start_date + timedelta(days=i)
                for i in range((end_date - start_date).days + 1)
            ]

            weekend_days = [day for day in requested_dates if day.weekday() >= 5]
            if weekend_days:
                logger.error("Weekends are not included in the days off.")
                return Response(
                    {"error": "Weekends are not included in the days off."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValueError as e:
            logger.error(f"Invalid date format: {e}")
            return Response(
                {"error": "Invalid date format. Expected format: YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )


    def check_holidays(self, start_date, end_date):
        from apps.shared.models import Holiday

        holidays = Holiday.objects.filter(date__range=[start_date, end_date])
        if holidays.exists():
            holiday_names = ", ".join(holiday.name for holiday in holidays)
            logger.error(f"Your leave request includes holidays: {holiday_names}")
            return Response(
                {"error": f"Your leave request includes holidays: {holiday_names}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def create(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        self.check_holidays(start_date, end_date)
        self.check_weekend(start_date, end_date)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        leave_request = serializer.save(employee=get_employee(request))
        return Response(
            self.get_serializer(leave_request).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["POST"], url_path="change-status")
    def change_status(self, request, pk=None):
        leave_request = self.get_object()
        employee = get_employee(request)

        if not employee.is_manager:
            logger.error("Unauthorized to change leave request status.")
            return Response(
                {"error": "Only managers can change the status of leave requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        new_status = request.data.get("status")
        if new_status not in [LeaveRequest.APPROVED, LeaveRequest.REJECTED]:
            logger.error(f"Invalid status, use approved or rejected: {new_status}")
            return Response(
                {"error": "Invalid status. Use 'approved' or 'rejected'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        leave_request.status = new_status
        leave_request.save()
        self.update_remaining_days(leave_request, new_status)

        if employee.remaining_leave_days < REMAINING_DAY_NOTIFICATION_LIMIT:
            from apps.notifications.tasks import notify_late_employee

            notify_late_employee.delay(
                employee.id,
                f"Employee {employee.full_name} has less than 3 leave days.",
            )

        return Response(
            {"message": f"Leave request {new_status}."}, status=status.HTTP_200_OK
        )
