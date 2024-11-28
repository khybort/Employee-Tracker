from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, LogoutView, EmployeeCreateView, EmployeeViewSet

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "",
        EmployeeViewSet.as_view(
            {
                "get": "list",
            }
        ),
        name="employee_list",
    ),
    path("create/", EmployeeCreateView.as_view(), name="create"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
