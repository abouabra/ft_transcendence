from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import InMemoryChannelLayer
import logging
import json
from channels.db import database_sync_to_async
from .models import Notification, User

logger = logging.getLogger(__name__)
channel_layer = InMemoryChannelLayer()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        type = data['type']
        receiver_id = data['receiver_id']
        sender_id = data['sender_id']

        if type == 'join_group':
            group_name = f'user_{sender_id}'
            await channel_layer.group_add(group_name, self.channel_name)
        else:
            await self.create_notification(data)
            group_name = f'user_{sender_id}'
            event = {
                'type': 'send_notification',
                'message': data  # Send entire data for flexibility
            }
            logger.error(f"NotificationConsumer: {event}")
            await channel_layer.group_send(group_name, event)

    async def send_notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def create_notification(self, data):
        new_notification = Notification.objects.create(
            sender=User.objects.get(id=data['sender_id']),
            receiver=User.objects.get(id=data['receiver_id']),
            type=data['type']
        )
        new_notification.save()

