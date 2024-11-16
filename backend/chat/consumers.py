import json
from .models import Message, Server
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import datetime
class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(f"room = {self.room_name} connecting")
        self.room_group_name = f"chat_{self.room_name}"
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"chat data = {text_data_json}")
        message = text_data_json["content"]
        server_name = text_data_json["server_name"]
        user_id = text_data_json["user_id"]
        server_chat = await self.get_server(server_name)
        print(f"server_chat = {server_chat.banned}")
        if (int(user_id) in server_chat.banned):
            return
        db_msg = await self.create_message(server_chat, user_id, message)
        text_data_json["message_id"] = db_msg.id
        print(f"Message send by {user_id} channel: {server_name} message: {message}")
        text_data_json['timestamp'] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        event = {
            "type": "chat_message",
            "message": text_data_json,
        }
        await self.channel_layer.group_send(self.room_group_name,event)


    @database_sync_to_async
    def get_server(self, name):
        try:
            return Server.objects.get(name=name)
        except Server.DoesNotExist:
            return None

    @database_sync_to_async
    def create_message(self, server_chat, user_id, message):
        return Message.objects.create(server = server_chat,sender_id=user_id, content=message)


    # Receive message from room group
    async def chat_message(self, event):
        text_data_json = event["message"]
        print(f"Message received by {self.room_name} channel: {text_data_json}")
        # Send message to WebSocket
        await self.send(text_data=json.dumps(text_data_json))

class ChatConsumerUserPermition(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(f"room_permition = {self.room_name} connecting")
        print(f"okay = {self.scope['user']}")
        self.room_group_name = f"chat_{self.room_name}_permition"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user_id = text_data_json["user_id"]
        changed = text_data_json["permition_to_change"]
        server_name = text_data_json["server_name"]
        event = {
            "type" : "permition_message",
            "message": f"{changed}",
            "user_id":user_id,
            "action":text_data_json["action"]
        }
        await self.channel_layer.group_send(self.room_group_name, event)

    @database_sync_to_async
    def get_server(self, name):
        try:
            return Server.objects.get(name=name)
        except Server.DoesNotExist:
            return None

    async def permition_message(self, event):
        text_data_json = {"message":event["message"], "user_id":event["user_id"], "action":event["action"]}
        await self.send(text_data=json.dumps(text_data_json))