from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from apps.shared.logger import logger
from apps.shared.utils import get_employee


class NotificationListView(APIView):
    def get(self, request):
        notifications = Notification.objects.filter(user=get_employee(request))
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class MarkNotificationAsReadView(APIView):
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(
                id=pk, user=get_employee(request)
            )
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read"})
        except Notification.DoesNotExist:
            logger.error(f"Notification with ID {pk} not found for user")
            return Response({"error": "Notification not found"}, status=404)
