from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone
from rest_framework.pagination import PageNumberPagination
from .models import Game_History, GameStats
import logging
from .utils import getUserData
from rest_framework import generics, permissions, status


logger = logging.getLogger(__name__)

class CreateGameStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_id):
        # create a new game stats for the user
        pong_game_stats = GameStats.objects.create(user_id=user_id, game_name="pong")
        pong_game_stats.save()

        space_invaders_game_stats = GameStats.objects.create(user_id=user_id, game_name="space_invaders")
        space_invaders_game_stats.save()

        road_fighter_game_stats = GameStats.objects.create(user_id=user_id, game_name="road_fighter")
        road_fighter_game_stats.save()

        return Response({"message": "Game Stats Created Successfully"}, status=status.HTTP_201_CREATED)
    


class HomeLeaderboardView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # i want to get the top 3 players with the highest elo from each game and return thier user_id
        top_3_pong = GameStats.objects.filter(game_name="pong").order_by('-current_elo')[:3]
        top_3_space_invaders = GameStats.objects.filter(game_name="space_invaders").order_by('-current_elo')[:3]
        top_3_road_fighter = GameStats.objects.filter(game_name="road_fighter").order_by('-current_elo')[:3]

        top_3_pong_user_ids = [getUserData(request, player.user_id) for player in top_3_pong]
        top_3_space_invaders_user_ids = [getUserData(request, player.user_id) for player in top_3_space_invaders]
        top_3_road_fighter_user_ids = [getUserData(request, player.user_id) for player in top_3_road_fighter]

        return Response({
            0: top_3_pong_user_ids,
            1: top_3_space_invaders_user_ids,
            2: top_3_road_fighter_user_ids
        }, status=status.HTTP_200_OK)


class HomeTotalTimeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        pong_total_time = GameStats.objects.get(user_id=request.user.id, game_name="pong").total_time_spent
        space_invaders_total_time = GameStats.objects.get(user_id=request.user.id, game_name="space_invaders").total_time_spent
        road_fighter_total_time = GameStats.objects.get(user_id=request.user.id, game_name="road_fighter").total_time_spent

        total_time = f"{(pong_total_time + space_invaders_total_time + road_fighter_total_time) / 3600:.2f}"
        pong_total_time = f"{pong_total_time / 3600:.2f}"
        space_invaders_total_time = f"{space_invaders_total_time / 3600:.2f}"
        road_fighter_total_time = f"{road_fighter_total_time / 3600:.2f}"



        return Response({
            "pong": pong_total_time,
            "space_invaders": space_invaders_total_time,
            "road_fighter": road_fighter_total_time,
            "total_time": total_time,
        }, status=status.HTTP_200_OK)


class HomeActiveGamesView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        query_params = request.query_params
        if "game_name" in query_params and query_params["game_name"] != "":
            game_name = query_params["game_name"]
            active_games = Game_History.objects.filter(game_name=game_name).order_by('-game_date')[:4]
        else:
            active_games = Game_History.objects.order_by('-game_date')[:4]

        active_games_data = []
        for game in active_games:
            player1 = getUserData(request, game.player1)
            player2 = getUserData(request, game.player2)
            game_name_index = [game[0] for game in Game_History.GAMES_CHOICES].index(game.game_name)
            active_games_data.append({
                "player1": player1,
                "player2": player2,
                "game_name": Game_History.GAMES_CHOICES[game_name_index][1],
                "player1_score": game.player_1_score,
                "player2_score": game.player_2_score,
            })
        
        return Response(active_games_data, status=status.HTTP_200_OK)
        




import random
class GenerateRandomGameHistoryData(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # generate random game history data
        games_choices = ["pong", "space_invaders", "road_fighter"]
        gamaes_types = ["ranked", "local", "ai"]
        user_ids = [1, 2]
        for i in range(10):
            player1 = random.choice(user_ids)
            player2 = user_ids[0] if player1 == user_ids[1] else user_ids[1]
            game_name = random.choice(games_choices)
            game_type = random.choice(gamaes_types)
            player_1_score = random.randint(0, 10)
            player_2_score = random.randint(0, 10)
            player1_elo_change = random.randint(-10, 10)
            player2_elo_change = random.randint(-10, 10)
            winner = random.choice([1, 2])
            game_duration = random.randint(10, 100)

            game_history = Game_History.objects.create(
                player1=player1,
                player2=player2,
                game_name=game_name,
                game_type=game_type,
                player_1_score=player_1_score,
                player_2_score=player_2_score,
                player1_elo_change=player1_elo_change,
                player2_elo_change=player2_elo_change,
                winner=winner,
                game_duration=game_duration
            )
            game_history.save()

        return Response({"message": "Game History Data Generated Successfully"}, status=status.HTTP_201_CREATED)