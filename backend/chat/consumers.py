import json
from .models import Message, Server
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(f"room = {self.room_name} connecting")
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    def receive(self, text_data):
        print("------------------------------")
        print("------------------------------")
        print("------------------------------")
        print("------------------------------")
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        server_name = text_data_json["server_name"]
        user_id = text_data_json["user_id"]
        server_chat = Server.objects.get(name=server_name)
        db_msg = Message(server = server_chat,sender_id=user_id, content=message)
        db_msg.save()
        print(f"Message send by {user_id}\nchannel:{server_name}\n{message}")
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(self.room_group_name,{
            "type": "chat_message",
            "message": message,
            "user_id":user_id,
            "server_name":server_name
        })

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        user_id = event["user_id"]
        server_name = event["server_name"]
        # Send message to WebSocket

        self.send(text_data=json.dumps({
            "message": message,
            "user_id":user_id,
            "server_name":server_name
        }))
