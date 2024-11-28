from django.db import models
from apps.employees.models import Employee


class Notification(models.Model):
    user = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.full_name}: {'Read' if self.is_read else 'Unread'}"
