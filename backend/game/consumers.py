from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Game_History, GameStats
import asyncio
from .utils import update_stats_after_game, ELO_System, getUserData
from django.http import HttpRequest
from rest_framework_simplejwt.tokens import RefreshToken

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
        self.game_time = 0
        self.finished_peacefully = False
        self.ball_position = None

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

        self.canvas_width = 1
        self.canvas_height = 1
        
        self.health = -1
        self.score = 0

        self.is_in_queue = False

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
    
    def get_pong_data(self):
        return {
            'position': self.position,
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
                            
                            if(GAME_ROOMS[game_room_id].game_task != None):
                                GAME_ROOMS[game_room_id].game_task.cancel()
                            
                            opponent = GAME_ROOMS[game_room_id].player1 if GAME_ROOMS[game_room_id].player2 == PLAYERS[game_name][object] else GAME_ROOMS[game_room_id].player2
                            
                            if(GAME_ROOMS[game_room_id].finished_peacefully == False):
                                game_obj = GAME_ROOMS[game_room_id]
                                me = PLAYERS[game_name][object]
                                await self.stats_wrapper(game_obj, me, opponent)

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
                            await self.close()
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
            

            player.is_in_queue = True

            PLAYERS[game_name][user_data["id"]] = player
            

            await self.check_queue(player, game_name)
        
        elif type == 'join_custom_game':
            player_data = {
                'id': text_data_json['player_id'],
                'username': text_data_json['player_username'],
                'avatar': text_data_json['player_avatar'],
            }

            game_name = text_data_json['game_name']
            game_id= int(text_data_json['game_id'])
        

        
            player = Player(player_data, game_name, self)

            PLAYERS[game_name][player_data["id"]] = player
            player.is_in_queue = False


            logger.error(f"\n\n\nPlayer {player} joined the game {game_name}\n\n\n")


            match_history = await self.get_match_history(game_id)
            logger.error(f'\n\n\nmatch_history: {match_history}\n\n\n')

            if match_history.player1 != None and match_history.player2 != None and match_history.isTournemantMatch == True and (match_history.player1 == player_data["id"] or match_history.player2 == player_data["id"]):                
                player = await self.getUserDataWrapper(player_data["id"])

                PLAYERS[game_name][player["id"]] = Player(player, game_name, self)

                # try :
                if (match_history.player1 in PLAYERS[game_name] and match_history.player2 in PLAYERS[game_name] and PLAYERS[game_name][match_history.player1] is not None and PLAYERS[game_name][match_history.player2] is not None):
                    game_obj = Game_Room(match_history.id, game_name, PLAYERS[game_name][match_history.player1], PLAYERS[game_name][match_history.player2])
                    GAME_ROOMS[game_obj.id] = game_obj
                    await self.start_initial_game_state(GAME_ROOMS[game_obj.id])
                # except Exception as e:
                #     pass
                
                return


            if match_history.player1 == None:
                match_history.player1 = player_data["id"]
                game_obj = Game_Room(match_history.id ,game_name, player, None)
                GAME_ROOMS[game_obj.id] = game_obj
            else:
                match_history.player2 = player_data["id"]
                game_obj = Game_Room(match_history.id, game_name, PLAYERS[game_name][match_history.player1], player)
                GAME_ROOMS[game_obj.id] = game_obj



            if GAME_ROOMS[game_obj.id].player1 != None and GAME_ROOMS[game_obj.id].player2 != None:
                await self.start_initial_game_state(GAME_ROOMS[game_obj.id])




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
            game_time = text_data_json["game_time"]
            game_obj = GAME_ROOMS[text_data_json["game_room_id"]]
            game_obj.game_time = game_time
            game_obj.finished_peacefully = True

            me = game_obj.player1 if game_obj.player1.user_id == user_id else game_obj.player2
            opponent = game_obj.player1 if game_obj.player2.user_id == user_id else game_obj.player2
            

            message = {
                    'type': 'game_over',
                    'winner': opponent.get_user_info(),
                    'loser': me.get_user_info(),
                }
            
            await opponent.ws_obj.send(text_data=json.dumps(message))
            await me.ws_obj.send(text_data=json.dumps(message))
            
            if(game_obj.game_task != None):
                game_obj.game_task.cancel()
            
            await self.stats_wrapper(game_obj, me, opponent)


            await opponent.ws_obj.close()

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

        logger.error(f'len of match making queue: {len(PLAYERS[game_name])}')
        queue_len = await self.count_players(game_name)
        logger.error(f'count_players: {queue_len}')
        if queue_len == 2:
            logger.error(f'len of match making queue: {len(PLAYERS[game_name])}')
            player1, player2 = PLAYERS[game_name].values()
            
            player1.is_in_queue = False
            player2.is_in_queue = False

            match_history = await self.create_match_history(player1.user_id, player2.user_id, game_name)
            game_obj = Game_Room(match_history.id ,game_name, player1, player2)
            game_obj.match_history = match_history

            GAME_ROOMS[game_obj.id] = game_obj

            await self.start_initial_game_state(GAME_ROOMS[game_obj.id])

    async def count_players(self, game_name):
        # count the number of players in the game that are their is_in_queue attribute is False
        new_players = [player for player in PLAYERS[game_name].values() if player.is_in_queue == True]
        return len(new_players)


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
        }
        

        if game_obj.game_name == "space_invaders":
            message["initial_data"] = {
                player1.user_id: {'x': 0, 'y': 0, 'z': 50},
                player2.user_id: {'x': 0, 'y': 0, 'z': -50},
            }

        
        elif game_obj.game_name == "pong":
            game_obj.ball_position = {'x': 0, 'y': 20}
            
            message["initial_data"] = {
                "ball": game_obj.ball_position,
            }


        await player1.ws_obj.send(text_data=json.dumps(message))
        await player2.ws_obj.send(text_data=json.dumps(message))

    async def start_game_task(self, game_obj):
        if game_obj.game_name == "space_invaders":
            game_obj.game_task = asyncio.create_task(self.space_invaders_game_loop(game_obj.id))
        if game_obj.game_name == "pong":
            game_obj.game_task = asyncio.create_task(self.pong_game_loop(game_obj.id))


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


    async def pong_game_loop(self, game_id):
        game_obj = GAME_ROOMS[game_id]

        
        player1 = game_obj.player1
        player2 = game_obj.player2

        while True:
            await asyncio.sleep(1/60)
            message = {
                'type': 'si_from_server_to_client',
                'data' : player2.get_pong_data(),
            }

            await player1.ws_obj.send(text_data=json.dumps(message))

            x_relative = game_obj.ball_position['x'] / player1.canvas_width
            y_relative = game_obj.ball_position['y'] / player1.canvas_height

            x_relative = 1 - x_relative
            # y_relative = 1 - y_relative

            new_ball_position = {
                'x': x_relative * player2.canvas_width,
                'y': y_relative * player2.canvas_height,
            }

            message['data'] = player1.get_pong_data()
            message['data']["ball"] = new_ball_position

            await player2.ws_obj.send(text_data=json.dumps(message))



    async def si_send_from_client_to_server(self, text_data_json):
        try:
            game_id = text_data_json["game_id"]
            game = GAME_ROOMS[game_id]
            

            player = PLAYERS[game.game_name][text_data_json["user_id"]]
            opponent = game.player1 if game.player2 == player else game.player2
            
            if game.game_name == "space_invaders":
                player.position = text_data_json['position']
                player.quaternion = text_data_json['quaternion']
                player.score = text_data_json['score']
                PLAYERS['space_invaders'][opponent.user_id].health = text_data_json['opponent_health']
        
            elif game.game_name == "pong":
                player.position = text_data_json['paddle_position']
                player.score = text_data_json['score']
                player.canvas_width = text_data_json['canvas_width']
                player.canvas_height = text_data_json['canvas_height']


                if game.player1.user_id == player.user_id:
                    game.ball_position['x'] = float(text_data_json['ball']['x'])
                    game.ball_position['y'] = float(text_data_json['ball']['y'])

        except Exception as e:
            pass

    @database_sync_to_async
    def create_match_history(self, user_1_id, user_2_id, game_name):
        game =  Game_History.objects.create(player1=user_1_id, player2=user_2_id, game_name=game_name, game_type="ranked")
        logger.error(f'created a match history: {game}')
        
        return game
    
    @database_sync_to_async
    def get_match_history(self, game_id):
        return Game_History.objects.get(id=game_id)


    @database_sync_to_async
    def stats_wrapper(self, game_obj, me, opponent):

        player_1_score = game_obj.player1.score
        player_2_score = game_obj.player2.score

        match_obj = Game_History.objects.get(id=game_obj.id)

        match_obj.has_ended = True

        match_obj.player_1_score = player_1_score
        match_obj.player_2_score = player_2_score
        match_obj.game_duration = game_obj.game_time

        if player_1_score > player_2_score:
            match_obj.winner = game_obj.player1.user_id
        elif player_1_score < player_2_score:
            match_obj.winner = game_obj.player2.user_id
        else:
            match_obj.winner = 0

        match_obj.save()
        
        update_stats_after_game(me.user_id, opponent.user_id, "space_invaders", game_obj.id)



    @database_sync_to_async
    def getUserDataWrapper(self, user_id):

        request = HttpRequest()
        return getUserData(request, user_id, True)