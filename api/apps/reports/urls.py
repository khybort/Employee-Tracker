from django.urls import path
from .views import MonthlyWorkReport, EmployeeSummaryView

urlpatterns = [
    path("monthly-work/", MonthlyWorkReport.as_view(), name="monthly_work_report"),
    path(
        "summary/<int:employee_id>/",
        EmployeeSummaryView.as_view(),
        name="employee-summary",
    ),
]
