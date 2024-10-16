from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Game_History, GameStats
from .serializers import GameStatsSerializer,GameHistorySerializer

logger = logging.getLogger(__name__)

user_queue = []



class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'main_playing_room'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        if message_type == 'join_game':
            user_id = text_data_json['user_id']
            await self.add_to_queue(user_id)

        elif message_type == 'game_move':
            await self.process_move(text_data_json)


    async def add_to_queue(self, user_id):
        logger.error(f'add_to_queue: {user_id}')
        
        if user_id not in user_queue:
            user_queue.append(user_id)

        if len(user_queue) >= 2:
            logger.error(f'len of user_queue: {len(user_queue)}')
            player1, player2 = user_queue.pop(0), user_queue.pop(0)
            await self.start_game(player1, player2)


    async def start_game(self, player1, player2):
        logger.error(f'start_game between {player1} and {player2}')
        message = {
            'type': 'start_game',
            'player1': player1,
            'player2': player2,
        }

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': message 
        })

    async def process_move(self, text_data_json):
        logger.error('process_move')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': text_data_json
            }
        )


    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))



    @database_sync_to_async
    def create_notification(self, data):
        pass
    
    @database_sync_to_async
    def get_user_info(self, user_id):
        pass









user_queue = []

class Match_Making_APP(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'game_room'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        if message_type == 'join_game':
            user_id = text_data_json['user_id']
            await self.add_to_queue(user_id)

        elif message_type == 'game_move':
            await self.process_move(text_data_json)

    async def add_to_queue(self, user_id):
        logger.error('add_to_queue')
        
        if user_id not in user_queue:
            user_queue.append(user_id)

        if len(user_queue) >= 2:
            logger.error('len of user_queue:', len(user_queue))
            player1, player2 = user_queue.pop(0), user_queue.pop(0)
            await self.start_game(player1, player2)


    async def start_game(self, player1, player2):
        logger.error('start_game')
        message = {
            'type': 'start_game',
            'player1': player1,
            'player2': player2,
        }
        await self.send_message(player1, message)

    async def send_message(self, user, message):
        logger.error('send_message')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )


    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))


    async def process_move(self, text_data_json):
        logger.error('process_move')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': text_data_json
            }
        )