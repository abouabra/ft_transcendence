from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Tournament_Bracket, Tournament_History, TournamentStats
# Create your views here.

class CreateTournamentStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_id):
        # create a new game stats for the user
        pong_tournament_stats = TournamentStats.objects.create(user_id=user_id, game_name="pong")
        pong_tournament_stats.save()

        space_invaders_tournament_stats = TournamentStats.objects.create(user_id=user_id, game_name="space_invaders")
        space_invaders_tournament_stats.save()

        road_fighter_tournament_stats = TournamentStats.objects.create(user_id=user_id, game_name="road_fighter")
        road_fighter_tournament_stats.save()

        return Response({"message": "Tournament Stats Created Successfully"}, status=status.HTTP_201_CREATED)


class HomeActiveTournamentsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        query_params = request.query_params
        if "game_name" in query_params and query_params["game_name"] != "":
            game_name = query_params["game_name"]
            active_tournaments = Tournament_History.objects.filter(game_name=game_name).order_by('-created_at')[:4]
        else:
            active_tournaments = Tournament_History.objects.order_by('-created_at')[:4]

        active_tournaments_data = []
        for tournament in active_tournaments:
            tournament_name_index = [tournament[0] for tournament in Tournament_History.GAMES_CHOICES].index(tournament.game_name)
            active_tournaments_data.append({
                "tournament_id": tournament.id,
                "tournament_game": Tournament_History.GAMES_CHOICES[tournament_name_index][1],
                "tournament_name": tournament.name,
                "tournament_avatar": tournament.avatar,
                "total_number_of_players": tournament.total_number_of_players,
            })
        
        return Response(active_tournaments_data, status=status.HTTP_200_OK)
        














import random
class GenerateRandomTournamentHistoryData(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        for i in range(10):
            random_name = "Tournament " + ''.join(random.choices("abcdefghijklmnopqrstuvwxyz", k=10))
            game_choices = ["pong", "space_invaders", "road_fighter"]
            tournament = Tournament_History.objects.create(name=random_name, game_name=random.choice(game_choices))
            tournament.save()


        return Response({"message": "Tournament History Created Successfully"}, status=status.HTTP_201_CREATED)