from channels.generic.websocket import AsyncWebsocketConsumer
import json
from apps.shared.logger import logger


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info(f"New WebSocket connection: {self.scope['user'].username}")
        self.group_name = f"notifications_{self.scope['user'].id}"
        if self.scope["user"].is_authenticated:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        logger.info(f"WebSocket connection closed: {self.scope['user'].username}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        logger.info(f"Sending notification to group: {self.group_name}")
        await self.send(text_data=json.dumps(event["message"]))
