from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "id",
            "username",
            "full_name",
            "position",
            "hire_date",
            "annual_leave_days",
            "remaining_leave_days",
            "is_manager",
        ]


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "is_manager",
            "remaining_leave_days",
        ]


class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "username",
            "full_name",
            "email",
            "password",
            "position",
            "is_manager",
            "annual_leave_days",
            "remaining_leave_days",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "annual_leave_days": {"read_only": True},
            "remaining_leave_days": {"read_only": True},
        }

    def create(self, validated_data):
        validated_data["annual_leave_days"] = 15
        validated_data["remaining_leave_days"] = 15
        employee = Employee.objects.create_user(**validated_data)
        return employee


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, help_text="Enter your username")
    password = serializers.CharField(
        required=True, write_only=True, help_text="Enter your password"
    )

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid username or password.")
            if not user.is_active:
                raise serializers.ValidationError("This user account is inactive.")
        else:
            raise serializers.ValidationError(
                "Both username and password are required."
            )

        data["user"] = user
        return data
