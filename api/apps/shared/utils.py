from apps.employees.models import Employee


def get_employee(request) -> Employee:
    user = request.user
    if not user.is_authenticated:
        raise ValueError("User is not authenticated.")
    return user
