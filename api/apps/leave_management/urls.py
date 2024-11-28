from django.urls import path
from .views import LeaveRequestViewSet

urlpatterns = [
    path(
        "",
        LeaveRequestViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path(
        "<int:pk>/change-status/",
        LeaveRequestViewSet.as_view(
            {
                "post": "change_status",
            }
        ),
    ),
]
