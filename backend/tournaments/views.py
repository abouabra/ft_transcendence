from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Tournament_History, TournamentStats
from .models import Tournament_History, TournamentStats
from rest_framework.pagination import PageNumberPagination
from .serializers import TournamentHistorySerializer, ShortTournamentHistorySerializer

from .serializers import TournamentHistorySerializer, TournamentStatsSerializer
from django.contrib.auth.hashers import make_password
import base64
from .request_api import create_qr_code
from django.conf import settings
from .utils import find_emty_room, getUserData, Start_Playing
import json
from math import floor
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

class DeleteTournamentStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, user_id):
        # delete the game stats for the user
        try:
            pong_tournament_stats = TournamentStats.objects.filter(user_id=user_id, game_name="pong")
            pong_tournament_stats.delete()


            space_invaders_tournament_stats = TournamentStats.objects.filter(user_id=user_id, game_name="space_invaders")
            space_invaders_tournament_stats.delete()

            road_fighter_tournament_stats = TournamentStats.objects.filter(user_id=user_id, game_name="road_fighter")
            road_fighter_tournament_stats.delete()

            return Response({"message": "Tournament Stats Deleted Successfully"}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"message": "Tournament Stats Not Found"}, status=status.HTTP_404_NOT_FOUND)        



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
        

class HomeExpandedActiveTournamentsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5

    def get(self, request):
        query_params = request.query_params
        if "game_name" in query_params and query_params["game_name"] != "":
            game_name = query_params["game_name"]
            active_games = Tournament_History.objects.filter(game_name=game_name).order_by('-created_at')
        else:
            active_games = Tournament_History.objects.order_by('-created_at')

        page = self.paginate_queryset(active_games)
        if page is not None:
            serializer = TournamentHistorySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TournamentHistorySerializer(active_games, many=True)
        return self.get_paginated_response(serializer.data)



class GetTournamentInfo(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        try:
            tournament = Tournament_History.objects.get(id=pk)
            return Response(ShortTournamentHistorySerializer(tournament).data, status=status.HTTP_200_OK)


        except:
            return Response({"message": "Tournament Not Found"}, status=status.HTTP_404_NOT_FOUND)




class GetTournamentsData(generics.GenericAPIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        tournaments = Tournament_History.objects.all()
        serializer = TournamentHistorySerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Membertournament(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            if (request.query_params.get('tournament_name') is None):
                return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
            tournaments = Tournament_History.objects.get(name=request.query_params.get('tournament_name'))
            return Response({"members":tournaments.members}, status=status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)

class GetTournamentroomData(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        if (request.query_params.get('tournament_name') is None):
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
        tournament_name = request.query_params.get('tournament_name')
        try:
            tournament = Tournament_History.objects.get(name=tournament_name)
            if tournament:
                data = {
                    "tournament_name":tournament_name,
                    "visibility":tournament.visibility,
                    "avatar":tournament.avatar,
                    "members":len(tournament.members),
                    "room_size":tournament.room_size,
                    "game_name":tournament.game_name,

                }
            return Response(data, status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
    def post(self, request):
        try:
            tournament = Tournament_History.objects.get(name=request.data['tournament_name'])
            if request.user.id in tournament.members:
                return Response({"error":"user already joined the tournament"}, status.HTTP_400_BAD_REQUEST)
            
            if tournament.room_size == len(tournament.members):
                return Response({"error":"room is full"}, status.HTTP_400_BAD_REQUEST)
            if tournament.visibility == "private":
                if not request.data['password'] or not tournament.check_passwd(request.data['password']):
                    return Response({"error":"Wrong password"}, status.HTTP_400_BAD_REQUEST)
            match_room = tournament.bracket_data[tournament.bracket_data["current_round"]]
            match_instance = find_emty_room(match_room)
            if match_instance is None:
                return Response({"error":"room is full"}, status.HTTP_400_BAD_REQUEST)
            tournament.members.append(request.user.id)
            tournament.bracket_data[tournament.bracket_data["current_round"]][match_instance[0]][match_instance[1]] = request.user.id
            tournament.save()
            if (len(tournament.members) == tournament.room_size):
                tournament.status = "In progress"
                tournament.save()
                Start_Playing(request, tournament.id)
            return Response({"success":"user joined the tournament", "tournament_name":tournament.name}, status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)


def create_bracket(room_size):
    brackets = {}
    round = {"16":"round_of_16","8":"quarterfinals","4":"semifinals","2":"finals"}
    brackets["current_round"] = round[str(room_size)]
    while (room_size > 1):
        room_size = floor(room_size/2)
        bracket = []
        for _ in range(room_size):
            bracket.append([0,0])
        brackets[round[str(room_size*2)]] = bracket
    print(brackets)
    return brackets
        
class CreateTournamentroom(generics.GenericAPIView):

    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        request.data['password'] = make_password(request.data['password'])
        serializer = TournamentHistorySerializer(data=request.data)
        brackets = create_bracket(request.data['room_size'])
        brackets[brackets["current_round"]][0][0] = request.user.id
        request.data['bracket_data'] = brackets
        request.data['members'] = [request.user.id]
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            if request.data['img']:
                image = request.data['img'].split(',')[1]
                image = base64.b64decode(image)
                path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
                with open(path_in_disk,'wb') as file:
                    file.write(image)
            create_qr_code(data['avatar'], f"http://127.0.0.1:3000/tournament/join/?tourname_name={data['name']}",data['qr_code'].split('/')[-1])
            return Response({
                    "success": "Server Created Successfully"
                }, status=status.HTTP_201_CREATED)
        return Response({"error":serializer.errors["non_field_errors"]}, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request):

    #     try:
    #         server = Server.objects.get(name=request.data['old_name'])
    #     except Server.DoesNotExist:
    #         return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
    #     if (request.user.id not in server.staffs):
    #         return Response({"error":"you are not staff of this server"}, status.HTTP_400_BAD_REQUEST)
    #     data = request.data

    #     if data['img']:
    #         image = data['img'].split(',')[1]
    #         image = base64.b64decode(image)
    #         path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
    #         with open(path_in_disk,'wb') as file:
    #             file.write(image)
    #     create_qr_code(data['avatar'], f"http://127.0.0.1:3000/chat/join_server/{data['name']}/",data['qr_code'].split('/')[-1])
    #     server.name = data['name']
    #     server.visibility = data['visibility']
    #     server.avatar = data['avatar']
    #     server.qr_code = data['qr_code']
    #     print(f"nmade password = {server.password}")
    #     server.password = make_password(data['password'])
    #     print(f"made password = {server.password}")
    #     server.save()
    #     return Response({
    #             "success": "Server Created Successfully"
    #         }, status=status.HTTP_201_CREATED)


class TournamentjoinedUsers(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if (request.query_params.get('tournament_name') is None):
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
        tournament_name = request.query_params.get('tournament_name')
        try:
            tournament = Tournament_History.objects.get(name=tournament_name)
            print(tournament.bracket_data)
            users = {}
            for user_id in tournament.members:
                data = getUserData(request, user_id)
                users[user_id] = data

            data = {
                "users":users,
                "data":tournament.bracket_data,
                "avatar":tournament.avatar,
            }
            return Response(data, status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)


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

class testplaying(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        Start_Playing(request, Tournament_History.objects.get(name=request.query_params.get('tournament_name')).id)
        return Response({"message": "Tournament History Created Successfully"}, status=status.HTTP_201_CREATED)