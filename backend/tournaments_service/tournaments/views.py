from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Tournament_History, TournamentStats
from .models import Tournament_History, TournamentStats
from rest_framework.pagination import PageNumberPagination
from .serializers import TournamentHistorySerializer, ShortTournamentHistorySerializer
from channels.layers import get_channel_layer
from .serializers import TournamentHistorySerializer, TournamentStatsSerializer, ProfileTournamentHistorySerializer
from django.contrib.auth.hashers import make_password, check_password
import base64
from .request_api import create_qr_code
from django.conf import settings
from .utils import find_emty_room, getUserData, Start_Playing, getmatchdata
import json
from math import floor
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

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
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        tournaments = Tournament_History.objects.exclude(status="Ended").order_by('-created_at')
        tournamentjoined = tournaments.filter(members__contains=[request.user.id])
        if tournamentjoined:
            tournaments = tournamentjoined

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
                    "Nicknames":json.dumps(tournament.Nicknames),

                }
            return Response(data, status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)


    def post(self, request):
        try:
            tournamentjoined = Tournament_History.objects.filter(members__contains=[request.user.id]).exclude(status="Ended")
            if (tournamentjoined):
                return Response({"error":"user already joined a tournament"}, status.HTTP_400_BAD_REQUEST)
            tournament = Tournament_History.objects.get(name=request.data['tournament_name'])
            if request.user.id in tournament.members:
                return Response({"error":"user already joined the tournament"}, status.HTTP_400_BAD_REQUEST)
            
            if tournament.room_size == len(tournament.members):
                return Response({"error":"room is full"}, status.HTTP_400_BAD_REQUEST)
            if tournament.visibility == "private":
                if not check_password(request.data['password'], tournament.password):
                    return Response({"error":"Wrong password"}, status.HTTP_400_BAD_REQUEST)
            match_room = tournament.bracket_data[tournament.bracket_data["current_round"]]
            match_instance = find_emty_room(match_room)
            if match_instance is None:
                return Response({"error":"room is full"}, status.HTTP_400_BAD_REQUEST)

            tournament.Nicknames.update({request.user.id:request.data["nickname"]})
            tournament.members.append(request.user.id)
            tournament.total_number_of_players += 1
            tournament.bracket_data[tournament.bracket_data["current_round"]][match_instance[0]][match_instance[1]] = request.user.id
            tournament.save()
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
            bracket.append([0,0,0,0])
        brackets[round[str(room_size*2)]] = bracket
    logger.error(brackets)
    return brackets
        
class CreateTournamentroom(generics.GenericAPIView):

    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        tournament_joind = Tournament_History.objects.filter(members__contains=[request.user.id]).exclude(status="Ended")
        if tournament_joind:
            return Response({"error": "Can't create a tournament if you are participated in one"}, status=status.HTTP_401_UNAUTHORIZED)

        if check_reserver_uri(request.data["name"]):
            return Response({"error": "tournament name contains reserved uri character"}, status=status.HTTP_201_CREATED)
        if (request.data['visibility'] == "private" and request.data['password'] == ''):
            return Response({"error": "must enter password for private room"}, status=status.HTTP_201_CREATED)
        request.data['password'] = make_password(request.data['password'])
        request.data["Nicknames"] = {request.user.id:"King"}
        serializer = TournamentHistorySerializer(data=request.data)
        brackets = create_bracket(request.data['room_size'])
        brackets[brackets["current_round"]][0][0] = request.user.id
        request.data['bracket_data'] = brackets
        request.data['members'] = [request.user.id]
        if serializer.is_valid():
            instence = serializer.save()
            data = serializer.data
            if request.data['img']:
                image = request.data['img'].split(',')[1]
                image = base64.b64decode(image)
                path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
                with open(path_in_disk,'wb') as file:
                    file.write(image)

            if (not create_qr_code(data['avatar'], f"https://127.0.0.1/tournament/join_tournament/?room_name={data['name']}",data['qr_code'].split('/')[-1])):
                instence.qr_code = instence.avatar
                instence.save()
            return Response({
                    "success": "Server Created Successfully", "qr_code":instence.qr_code
                }, status=status.HTTP_201_CREATED)
        return Response({"error":serializer.errors["non_field_errors"]}, status=status.HTTP_400_BAD_REQUEST)

class TournamentjoinedUsers(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if (request.query_params.get('tournament_name') is None):
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
        tournament_name = request.query_params.get('tournament_name')
        try:
            tournament = Tournament_History.objects.get(name=tournament_name)
            if (request.user.id not in  tournament.members):
                return Response({"error":"Can't view tournament if you are not joined"}, status.HTTP_400_BAD_REQUEST)
            winner = 0
            if (tournament.status == "Ended"):
                winner = tournament.tournament_winner
            logger.error(tournament.bracket_data)
            users = {}
            for user_id in tournament.members:
                data = getUserData(request, user_id)
                data["username"] = tournament.Nicknames[f"{user_id}"]
                users[user_id] = data

            data = {
                "users":users,
                "data":tournament.bracket_data,
                "avatar":tournament.avatar,
                "winner":winner,
                "owner": tournament.members[0],
                "status":tournament.status
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
        try:
            tournament = Tournament_History.objects.get(name=request.query_params.get('tournament_name'))
            if (tournament.room_size != len(tournament.members)):
                return Response({"error":"Tournament is not full"}, status=400)
        except tournament.DoesNotExist:
            return Response({"error":"tournament not found"}, status.HTTP_404_NOT_FOUND)
        if (request.user.id == tournament.members[0]):
            if (tournament.status != "Waiting for players"):
                return Response({"error":"Tournament already started"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error":"you are not the tournament host"}, status.HTTP_400_BAD_REQUEST)

        if Start_Playing(request, tournament):
            return Response({"error":"Failed to start tournament"}, status.HTTP_400_BAD_REQUEST)

        return Response({"success": "Tournament History Created Successfully"}, status=status.HTTP_201_CREATED)

class advanceTournamentmatch(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            data = getmatchdata(request, request.data["game_id"])
            channel_layer = get_channel_layer()

            logger.error(f"\n\n\n+++++advanceTournamentmatch {data}+++++\n\n\n")

            tournament = Tournament_History.objects.get(id=data["tournament_id"])

            if (tournament.status == "Ended"):
                return Response({"error":"Tournament Ended"}, status=status.HTTP_400_BAD_REQUEST)
            current_round = tournament.bracket_data["current_round"]

            if (current_round == "quarterfinals"):
                next_round = "semifinals"
            elif current_round == "round_of_16":
                next_round = "quarterfinals"
            else:
                next_round = "finals"
            if (next_round == current_round):
                logger.error(f"inside next_round == current_round {next_round} {current_round}")
                tournament.status = "Ended"
                tournament.tournament_winner = data["winner"]
                tournament.bracket_data[current_round][0][2] = data["player_1_score"]
                tournament.bracket_data[current_round][0][3] = data["player_2_score"]
                tournament.save()
                async_to_sync(channel_layer.group_send)(
                    f"tournament_{tournament.name}",
                    {
                        "type": "tournament_message",
                        "message": "this is a garbage value in advanceTournamentmatch views",
                    },
                )

                return Response({"success":"Tournament Ended"}, status=status.HTTP_200_OK)
            datalist = tournament.bracket_data[current_round]
            bracket_tofill = 0
            place = 0
            logger.error(f"current = {current_round} next = {next_round}")
            for index, element in enumerate(datalist,start=0):
                if  place == 2:
                    bracket_tofill += 1
                    place = 0
                if (data["player1"]["id"] in element and data["player2"]["id"] in element):
                    logger.error(tournament.bracket_data[current_round][bracket_tofill])
                    tournament.bracket_data[current_round][index][2] = data["player_1_score"]
                    tournament.bracket_data[current_round][index][3] = data["player_2_score"]
                    tournament.bracket_data[next_round][bracket_tofill][place] = data["winner"]
                    tournament.save()
                place += 1
            logger.error(f"current = {current_round} next = {next_round}")
            matchlen = 0
            for element in tournament.bracket_data[next_round]:
                if (element[0] ==0 or element[1] == 0):
                    break
                matchlen += 1
            if matchlen == len(tournament.bracket_data[next_round]):
                tournament.bracket_data["current_round"] = next_round
                tournament.save()
                Start_Playing(request, tournament)
                async_to_sync(channel_layer.group_send)(
                    f"tournament_{tournament.name}",
                    {
                        "type": "tournament_message",
                        "message": "this is a garbage value in advanceTournamentmatch views",
                    },
                )

            return Response({"success": "Tournament game ended"}, status=status.HTTP_200_OK)
        except Tournament_History.DoesNotExist:
            return Response({"error":"Tournament not found"}, status=status.HTTP_404_NOT_FOUND)


class ProfileStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        try:
            tournament_stats = {}
            tournament_stats["pong"] = TournamentStats.objects.get(user_id=pk, game_name="pong")
            tournament_stats["space_invaders"] = TournamentStats.objects.get(user_id=pk, game_name="space_invaders")
            tournament_stats["road_fighter"] = TournamentStats.objects.get(user_id=pk, game_name="road_fighter")

            response_data = {"win_los_ratio": {}, "recent_tournaments": {}}
            for key in tournament_stats:
                response_data["win_los_ratio"][key] = int(tournament_stats[key].games_won / tournament_stats[key].total_games_played * 100) if tournament_stats[key].total_games_played != 0 else 0
            
            for game in ["pong", "space_invaders", "road_fighter"]:
                recent_tournaments = Tournament_History.objects.filter(game_name=game, members__contains=[pk], status="Ended").order_by('-created_at') # TODO: Replace Waiting for players with what baanni decides
                response_data["recent_tournaments"][game] = ProfileTournamentHistorySerializer(recent_tournaments, many=True, context={'user_id': pk}).data
            return Response(response_data, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Tournament Stats Not Found"}, status=status.HTTP_404_NOT_FOUND)
        

def check_reserver_uri(name):
    reserved_character = ":/?#[]@!$&'()*+,;="
    for char in name:
        if char in reserved_character:
            return True
    return False




class GetTournamentUserNickname(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            tournament_id = request.query_params.get("tournament_id")
            user_id = request.query_params.get("user_id")
            if not tournament_id or not user_id:
                return Response({"message": "Tournament ID or User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            tournament = Tournament_History.objects.get(id=tournament_id)
            logger.error(f"\n\n\nGetTournamentUserNickname: {tournament.Nicknames}\n\n\n")
            user_nickname = tournament.Nicknames[user_id]
            return Response({"nickname": user_nickname}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Tournament Not Found"}, status=status.HTTP_404_NOT_FOUND)