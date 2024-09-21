from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone
from rest_framework.pagination import PageNumberPagination
from .models import Game_Match, GameStats
import logging

logger = logging.getLogger(__name__)

class HomeLeaderboardView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # i want to get the top 3 players with the highest elo from each game and return thier user_id
        top_3_pong = GameStats.objects.filter(game_type="pong").order_by('-current_elo')[:3]
        top_3_space_invaders = GameStats.objects.filter(game_type="space_invaders").order_by('-current_elo')[:3]
        top_3_road_fighter = GameStats.objects.filter(game_type="road_fighter").order_by('-current_elo')[:3]

        top_3_pong_user_ids = [player.user_id for player in top_3_pong]
        top_3_space_invaders_user_ids = [player.user_id for player in top_3_space_invaders]
        top_3_road_fighter_user_ids = [player.user_id for player in top_3_road_fighter]

        return Response({
            "pong": top_3_pong_user_ids,
            "space_invaders": top_3_space_invaders_user_ids,
            "road_fighter": top_3_road_fighter_user_ids
        }, status=status.HTTP_200_OK)
    
class CreateGameStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_id):
        # create a new game stats for the user
        pong_game_stats = GameStats.objects.create(user_id=user_id, game_type="pong")
        pong_game_stats.save()

        space_invaders_game_stats = GameStats.objects.create(user_id=user_id, game_type="space_invaders")
        space_invaders_game_stats.save()

        road_fighter_game_stats = GameStats.objects.create(user_id=user_id, game_type="road_fighter")
        road_fighter_game_stats.save()

        return Response({"message": "Game Stats Created Successfully"}, status=status.HTTP_201_CREATED)