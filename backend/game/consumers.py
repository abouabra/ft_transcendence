from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Game_History, GameStats
from .serializers import GameStatsSerializer,GameHistorySerializer
from .utils import generate_id
import asyncio

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
        self.game_task = None
        self.client_ready = 0

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
        
        self.health = -1
        self.score = 0

    def __str__(self):
        return f"{self.user_id}"
    
    def get_user_info(self):
        return {
            'id': self.user_id,
            'username': self.username,
            'avatar': self.avatar,

        }

    def get_space_invaders_data(self):
        return {
            'position': self.position,
            'quaternion': self.quaternion,
            'score': self.score,
        }







class GameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        for game_name in PLAYERS :
            for object in PLAYERS[game_name]:
                if self == PLAYERS[game_name][object].ws_obj:
                    for game_room_id in GAME_ROOMS:
                        if PLAYERS[game_name][object] in [GAME_ROOMS[game_room_id].player1, GAME_ROOMS[game_room_id].player2]:
                            GAME_ROOMS[game_room_id].game_task.cancel()
                            
                            opponent = GAME_ROOMS[game_room_id].player1 if GAME_ROOMS[game_room_id].player2 == PLAYERS[game_name][object] else GAME_ROOMS[game_room_id].player2
                            
                            await opponent.ws_obj.send(text_data=json.dumps({
                                'type': 'game_over',
                                'winner': opponent.get_user_info(),
                                'loser': PLAYERS[game_name][object].get_user_info(),
                            }))
                            
                            if(GAME_ROOMS[game_room_id].player1 != None):
                                await GAME_ROOMS[game_room_id].player1.ws_obj.close()
                                del PLAYERS[game_name][GAME_ROOMS[game_room_id].player1.user_id]
                            if(GAME_ROOMS[game_room_id].player2 != None):
                                await GAME_ROOMS[game_room_id].player2.ws_obj.close()
                                del PLAYERS[game_name][GAME_ROOMS[game_room_id].player2.user_id]
                            
                            del GAME_ROOMS[game_room_id]
                            self.close()
                            return 

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

            await self.check_queue(player, game_name)

        elif type == "cancel_match_making":
            user = text_data_json["user"]
            user_id = user["id"]
            game_name = text_data_json["game_name"]
            del PLAYERS[game_name][user_id]

        elif type == 'si_send_from_client_to_server':
            await self.si_send_from_client_to_server(text_data_json)

        elif type == "game_over":
            logger.error(f'\n\n\ngame_over: {text_data_json}\n\n\n')
            user_id = text_data_json["user_id"]
            game_obj = GAME_ROOMS[text_data_json["game_room_id"]]
            
            me = game_obj.player1 if game_obj.player1.user_id == user_id else game_obj.player2
            opponent = game_obj.player1 if game_obj.player2.user_id == user_id else game_obj.player2
            
            message = {
                    'type': 'game_over',
                    'winner': opponent.get_user_info(),
                    'loser': me.get_user_info(),
                }
            
            await opponent.ws_obj.send(text_data=json.dumps(message))
            await me.ws_obj.send(text_data=json.dumps(message))
            

            game_obj.game_task.cancel()
            
            await opponent.ws_obj.close()
            await me.ws_obj.close()
            
            del PLAYERS["space_invaders"][me.user_id]
            del PLAYERS["space_invaders"][opponent.user_id]
            
            game_obj.player1 = None
            game_obj.player2 = None

            await self.disconnect(1000)
        
        
        elif type == "si_clients_ready":
            game_obj = GAME_ROOMS[text_data_json["game_room_id"]]
            game_obj.client_ready += 1
            
            
            if game_obj.client_ready == 2:
                await self.start_game_task(game_obj)

    async def check_queue(self, player, game_name):
        logger.error(f'check_queue: {player.user_id} , {game_name}')

        if len(PLAYERS[game_name]) >= 2:
            logger.error(f'len of match making queue: {len(PLAYERS[game_name])}')
            player1, player2 = PLAYERS[game_name].values()
            
            match_history = await self.create_match_history(player1.user_id, player2.user_id, game_name)
            game_obj = Game_Room(match_history.id ,game_name, player1, player2)
            game_obj.match_history = match_history

            GAME_ROOMS[game_obj.id] = game_obj

            await self.start_initial_game_state(GAME_ROOMS[game_obj.id])


    async def start_initial_game_state(self, game_obj):
        player1 = game_obj.player1
        player2 = game_obj.player2

        # pop the two players from the PLAYERS dict
        
        logger.error(f'start_game between {player1} and {player2}')

        message = {
            'type': 'start_game',
            'player1': player1.get_user_info(),
            'player2': player2.get_user_info(),
            "game_room_id": game_obj.id,

            "initial_data": {
                player1.user_id: {'x': 0, 'y': 0, 'z': 50},
                player2.user_id: {'x': 0, 'y': 0, 'z': -50},
            }
        }

        await player1.ws_obj.send(text_data=json.dumps(message))
        await player2.ws_obj.send(text_data=json.dumps(message))

    async def start_game_task(self, game_obj):
        game_obj.game_task = asyncio.create_task(self.space_invaders_game_loop(game_obj.id))


    async def space_invaders_game_loop(self, game_id):
        game_obj = GAME_ROOMS[game_id]
        
        player1 = game_obj.player1
        player2 = game_obj.player2

        while True:
            await asyncio.sleep(1/60) # 60 fps
            message = {
                'type': 'si_from_server_to_client',
                'data' : player2.get_space_invaders_data(),
                'health': player1.health,
            }

            await player1.ws_obj.send(text_data=json.dumps(message))
            
            message['data'] = player1.get_space_invaders_data()
            message['health'] = player2.health



            await player2.ws_obj.send(text_data=json.dumps(message))



    async def si_send_from_client_to_server(self, text_data_json):
        try:
            player = PLAYERS['space_invaders'][text_data_json["user_id"]]
            
            player.position = text_data_json['position']
            player.quaternion = text_data_json['quaternion']
            player.score = text_data_json['score']
            
            game_id = text_data_json["game_id"]
            game = GAME_ROOMS[game_id]
            opponent = game.player1 if game.player2 == player else game.player2

            PLAYERS['space_invaders'][opponent.user_id].health = text_data_json['opponent_health']
        

        except Exception as e:
            pass



    @database_sync_to_async
    def create_match_history(self, user_1_id, user_2_id, game_name):
        game =  Game_History.objects.create(player1=user_1_id, player2=user_2_id, game_name=game_name, game_type="ranked")
        logger.error(f'created a match history: {game}')
        
        return game