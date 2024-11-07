from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Notification, User
from .serializers import ShortUserSerializer

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = 0
        self.goup_name = 0
        await self.accept()

    async def disconnect(self, close_code):
        if self.user_id:
            await self.set_status(self.user_id, 'offline')
            group_name = f'user_{self.user_id}'
            await self.channel_layer.group_discard(group_name, self.channel_name)
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        type = data['type']
        receiver_id = data['receiver_id']
        sender_id = data['sender_id']

        try:
            receiver_data = await self.get_user_info(receiver_id)
            sender_data = await self.get_user_info(sender_id)

        except User.DoesNotExist:
            return await self.send(text_data=json.dumps({
                'error': 'User does not exist'
            }))
        
        data['receiver'] = receiver_data
        data['sender'] = sender_data


        if type == 'join_group':
            group_name = f'user_{sender_id}'
            self.user_id = sender_id
            await self.set_status(sender_id, 'online')
            await self.channel_layer.group_add(group_name, self.channel_name)
        else:
            await self.create_notification(data)
            group_name = f'user_{receiver_id}'
            event = {
                'type': 'send_notification',
                'message': data  # Send entire data for flexibility
            }
            await self.channel_layer.group_send(group_name, event)

    async def send_notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def create_notification(self, data):
        try:
           
            Notification.objects.create(
                sender=User.objects.get(id=data['sender_id']),
                receiver=User.objects.get(id=data['receiver_id']),
                type=data['type']
            )
        except User.DoesNotExist:
            pass
    
    @database_sync_to_async
    def get_user_info(self, user_id):
        user_serialized_data = ShortUserSerializer(User.objects.get(id=user_id)).data
        return user_serialized_data
    
    @database_sync_to_async
    def set_status(self, user_id, status):
        user = User.objects.get(id=user_id)
        user.status = status
        user.save()