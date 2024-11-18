import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TournamentConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(f"room = {self.room_name} connecting")
        self.room_group_name = f"tournament_{self.room_name}"
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"tournament data = {text_data_json}")
        event = {
            "type": "tournament_message",
            "message": text_data_json,
        }
        await self.channel_layer.group_send(self.room_group_name,event)

    # Receive message from room group
    async def tournament_message(self, event):
        text_data_json = event["message"]
        print(f"Message received by {self.room_name} channel: {text_data_json}")
        # Send message to WebSocket
        await self.send(text_data=json.dumps(text_data_json))
