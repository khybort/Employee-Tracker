from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import EmployeeSerializer, LoginSerializer, EmployeeCreateSerializer


class EmployeeCreateView(APIView):
    @swagger_auto_schema(
        request_body=EmployeeCreateSerializer,
        responses={
            201: openapi.Response("User created successfully", EmployeeSerializer),
            400: "Invalid Credentials",
        },
    )
    def post(self, request):
        serializer = EmployeeCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeViewSet(ReadOnlyModelViewSet):
    from apps.employees.models import Employee

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response("Employee List", EmployeeSerializer(many=True)),
        },
        operation_id="get_employees",
        tags=["Employees"],
        description="List of all employees",
    )
    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)


class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: openapi.Response("Login Successful", EmployeeSerializer),
            400: "Invalid Credentials",
        },
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": EmployeeSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    def post(self, request):
        return Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )
