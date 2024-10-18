from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Game_History, GameStats
from .serializers import GameStatsSerializer,GameHistorySerializer
from .utils import generate_id

logger = logging.getLogger(__name__)

GAME_ROOMS = {}

PLAYERS = {
    "pong": {},
    "space_invaders": {},
    "road_fighter": {},
}

class Game_Room():
    def __init__(self,game_id, game_name, player1, player2):
        self.id = game_id
        self.game_name = game_name
        self.player1 = player1
        self.player2 = player2
        self.match_history = None

    def __str__(self):
        return f"{self.game_name} - {self.player1} - {self.player2}"

class Player():
    def __init__(self, user_data, game_name, ws_obj):
        self.user_id = user_data['id']
        self.username = user_data['username']
        self.avatar = user_data['avatar']
    
        self.game_name = game_name
        self.ws_obj = ws_obj

        self.position = None
        self.quaternion = None

    def __str__(self):
        return f"{self.user_id}"
    
    def get_user_info(self):
        return {
            'id': self.user_id,
            'username': self.username,
            'avatar': self.avatar,
        }

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        # search for the player in the PLAYERS dict and remove them
        for game_name in PLAYERS:
            if self.scope['user'].id in PLAYERS[game_name]:
                del PLAYERS[game_name][self.scope['user'].id]
                break

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        type = text_data_json['type']

        if type == 'join_game':
            user_data = {
                'id': text_data_json["user"]["id"],
                'username': text_data_json["user"]["username"],
                'avatar': text_data_json["user"]["avatar"],
            }

            player = Player(user_data, text_data_json['game_name'], self)
            game_name = text_data_json['game_name']

            PLAYERS[game_name][user_data["id"]] = player

            await self.add_to_queue(player, game_name)

        elif type == "cancel_match_making":
            user = text_data_json["user"]
            user_id = user["id"]
            game_name = text_data_json["game_name"]
            del PLAYERS[game_name][user_id]

        elif type == 'si_receive_data_from_client':
            await self.si_receive_data_from_client(text_data_json)


    async def add_to_queue(self, player, game_name):
        logger.error(f'add_to_queue: {player.user_id} , {game_name}')
        
        if len(PLAYERS[game_name]) >= 2:
            logger.error(f'len of match making queue: {len(PLAYERS[game_name])}')
            player1, player2 = PLAYERS[game_name].values()
            
            match_history = await self.create_match_history(player1.user_id, player2.user_id, game_name)
            game_obj = Game_Room(match_history.id ,game_name, player1, player2)
            game_obj.match_history = match_history

            GAME_ROOMS[game_obj.id] = game_obj

            await self.start_game(GAME_ROOMS[game_obj.id])


    async def start_game(self, game_obj):
        player1 = game_obj.player1
        player2 = game_obj.player2

        logger.error(f'start_game between {player1} and {player2}')

        message = {
            'type': 'start_game',
            'player1': player1.get_user_info(),
            'player2': player2.get_user_info(),
            "game_room_id": game_obj.id,
        }

        await player1.ws_obj.send(text_data=json.dumps(message))
        await player2.ws_obj.send(text_data=json.dumps(message))


    async def process_move(self, text_data_json):
        logger.error('process_move')
        game_obj = GAME_ROOMS[text_data_json['game_room_id']]
        player1 = game_obj.player1
        player2 = game_obj.player2

        pass


    async def si_receive_data_from_client(self, text_data_json):
        player = PLAYERS['space_invaders'][text_data_json["user_id"]]
        game = GAME_ROOMS[text_data_json['game_id']]
        
        player2 = game.player2 if game.player1.user_id == player.user_id else game.player1
        
        text_data_json['type'] = 'si_receive_data_from_server'
        
        player2.ws_obj.send(text_data=json.dumps(text_data_json))

    @database_sync_to_async
    def create_match_history(self, user_1_id, user_2_id, game_name):
        game =  Game_History.objects.create(player1=user_1_id, player2=user_2_id, game_name=game_name, game_type="ranked")
        logger.error(f'created a match history: {game}')
        
        return game

    @database_sync_to_async
    def get_user_info(self, user_id):
        pass





