from django.urls import path
from .views import AttendanceViewSet

urlpatterns = [
    path(
        "",
        AttendanceViewSet.as_view(
            {
                "post": "record_attendance",
                "get": "list",
            }
        ),
        name="attendance",
    ),
    path(
        "summary/",
        AttendanceViewSet.as_view({"get": "get_summary"}),
        name="attendance-summary",
    ),
]
