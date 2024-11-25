from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Game_History, GameStats
import logging
from .utils import getUserData
from rest_framework import generics, permissions, status
from .serializers import GameStatsSerializer, GameHistorySerializer, LeaderboardSerializer, ProfileGameHistorySerializer, GameInfoGameHistorySerializer
from .utils import update_stats_after_game, sendHTTPNotification, getTournamentProfileStats, generate_elo_graph, sendAdvanceMatchRequest
from django.db.models import Q

logger = logging.getLogger(__name__)

class CreateGameStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_id):
        # check if the user already has a game stats
        try:
            GameStats.objects.get(user_id=user_id, game_name="pong")
            return Response({"message": "Game Stats Already Exists"}, status=status.HTTP_200_OK)
        
        except GameStats.DoesNotExist:
            pass

        # create a new game stats for the user
        pong_game_stats = GameStats.objects.create(user_id=user_id, game_name="pong")
        pong_game_stats.save()

        space_invaders_game_stats = GameStats.objects.create(user_id=user_id, game_name="space_invaders")
        space_invaders_game_stats.save()

        road_fighter_game_stats = GameStats.objects.create(user_id=user_id, game_name="road_fighter")
        road_fighter_game_stats.save()

        return Response({"message": "Game Stats Created Successfully"}, status=status.HTTP_201_CREATED)
    

class DeleteGameStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, user_id):
        try:
            pong_game_stats = GameStats.objects.get(user_id=user_id, game_name="pong")
            pong_game_stats.delete()

            space_invaders_game_stats = GameStats.objects.get(user_id=user_id, game_name="space_invaders")
            space_invaders_game_stats.delete()

            road_fighter_game_stats = GameStats.objects.get(user_id=user_id, game_name="road_fighter")
            road_fighter_game_stats.delete()
        
            return Response({"message": "Game Stats Deleted Successfully"}, status=status.HTTP_204_NO_CONTENT)
        except GameStats.DoesNotExist:
            return Response({"message": "Game Stats Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while deleting game stats"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        

class HomeLeaderboardView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        excluded_user_ids = [1, 2]
        
        top_3_pong = GameStats.objects.filter(game_name="pong").exclude(user_id__in=excluded_user_ids).order_by('-current_elo')[:3]
        top_3_space_invaders = GameStats.objects.filter(game_name="space_invaders").exclude(user_id__in=excluded_user_ids).order_by('-current_elo')[:3]
        top_3_road_fighter = GameStats.objects.filter(game_name="road_fighter").exclude(user_id__in=excluded_user_ids).order_by('-current_elo')[:3]

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
            active_games = Game_History.objects.filter(game_name=game_name, winner=0).order_by('-game_date')[:4]
        else:
            active_games = Game_History.objects.filter(winner=0).order_by('-game_date')[:4]

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
    
class HomeExpandedActiveGamesView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5

    def get(self, request):
        query_params = request.query_params
        if "game_name" in query_params and query_params["game_name"] != "":
            game_name = query_params["game_name"]
            active_games = Game_History.objects.filter(game_name=game_name).order_by('-game_date')
        else:
            active_games = Game_History.objects.order_by('-game_date')

        page = self.paginate_queryset(active_games)
        if page is not None:
            serializer = GameHistorySerializer(page, many=True)
            for game in serializer.data:
                game["player1"] = getUserData(request, game["player1"])
                game["player2"] = getUserData(request, game["player2"])
                game_type_index = [game[0] for game in Game_History.GAMES_TYPES].index(game["game_type"])
                game["game_type"] = Game_History.GAMES_TYPES[game_type_index][1]
                game["game_duration"] = f"{game['game_duration'] // 60}:{str(game['game_duration'] % 60).zfill(2)}"
                game["player1"]["current_elo"] = GameStats.objects.get(user_id=game["player1"]["id"], game_name=game["game_name"]).current_elo
                game["player2"]["current_elo"] = GameStats.objects.get(user_id=game["player2"]["id"], game_name=game["game_name"]).current_elo
            return self.get_paginated_response(serializer.data)
        
        serializer = GameHistorySerializer(active_games, many=True)
        for game in serializer.data:
                game["player1"] = getUserData(request, game["player1"])
                game["player2"] = getUserData(request, game["player2"])
                game_type_index = [game[0] for game in Game_History.GAMES_TYPES].index(game["game_type"])
                game["game_type"] = Game_History.GAMES_TYPES[game_type_index][1]
                game["game_duration"] = f"{game['game_duration'] // 60}:{str(game['game_duration'] % 60).zfill(2)}"
                game["player1"]["current_elo"] = GameStats.objects.get(user_id=game["player1"]["id"], game_name=game["game_name"]).current_elo
                game["player2"]["current_elo"] = GameStats.objects.get(user_id=game["player2"]["id"], game_name=game["game_name"]).current_elo
        return self.get_paginated_response(serializer.data)
    


class ConstructGameHistoryData(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        player_1 = request.data["user_id"]
        game_type = request.data["game_type"]

        if game_type == "local":
            player_2 = getUserData(request, username="local_user")["id"]
        else:
            player_2 = request.data["opponent_id"]

        game_name = request.data["game_name"]

        game_obj = Game_History.objects.create(
            player1=player_1,
            player2=player_2,
            game_name=game_name,
            game_type=game_type,
        )

        game_obj.save()

        return Response({
            "game_room_id": game_obj.id,
        }, status=status.HTTP_201_CREATED)


class GetGameInfo(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = GameInfoGameHistorySerializer

    def get(self, request, pk):
        try:
            logged_in_user_id = request.user.id
            game_obj = Game_History.objects.get(id=pk)
            game_info = self.serializer_class(game_obj).data
           
            game_info["player1"] = getUserData(request, game_info["player1"])
            game_info["player2"] = getUserData(request, game_info["player2"])

            logger.error(f" player1 {game_info["player1"]}    player2 {game_info["player2"]}")

            # if(game_info["player1"]["id"] != logged_in_user_id and game_info["player2"]["id"] != logged_in_user_id):
            #     return Response({"detail": "You are not part of this game"}, status=status.HTTP_403_FORBIDDEN)


            return Response(game_info, status=status.HTTP_200_OK)
        except Game_History.DoesNotExist:
            return Response({"detail": "Game Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while fetching the game"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class PongEndGame(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            game_id = request.data["game_id"]
            score1 = request.data["score1"]
            score2 = request.data["score2"]
            time = request.data["time"]

            game_obj = Game_History.objects.get(id=game_id)
            logger.error(f"==============\n\n {game_obj} \n\n==============")
            if score1 > score2:
                winner_id = game_obj.player1
                loser_id = game_obj.player2
            else:
                winner_id = game_obj.player2
                loser_id = game_obj.player1

            game_obj.winner = winner_id
            game_obj.player_1_score = score1
            game_obj.player_2_score = score2
            game_obj.game_duration = time
            game_obj.has_ended = True
            game_obj.save()

            update_stats_after_game(game_obj.player1, game_obj.player2, game_obj.game_name, game_obj)
            
            return Response({
                "winner": getUserData(request, winner_id),
                "loser": getUserData(request, loser_id),
            }, status=status.HTTP_200_OK)

        except Game_History.DoesNotExist:
            return Response({"detail": "Game Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while ending the game"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LeaderboardView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LeaderboardSerializer

    def get(self, request):
        excluded_user_ids = [1, 2]
        query_params = request.query_params
        if "game_name" in query_params and query_params["game_name"] != "":
            game_name = query_params["game_name"]
            leaderboard = GameStats.objects.filter(game_name=game_name).exclude(user_id__in=excluded_user_ids).order_by('-current_elo')
        else:
            leaderboard = GameStats.objects.filter(game_name="pong").exclude(user_id__in=excluded_user_ids).order_by('-current_elo')

        serializer = self.serializer_class(leaderboard, many=True)
        for player in serializer.data:
            player["user"] = getUserData(request, player["user_id"])
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ConstructTournamentGame(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = request.data

        tournament_data = {
            "isTournemantMatch": True,
            "tournament_id": request.data["tournament_id"]
        } if "tournament_id" in request.data else {}

        if "tournament_id" in request.data:
            print("tournament_id", request.data["tournament_id"])
        
        shouldSendNotification = True

        game_obj = Game_History.objects.create(
            player1=data["player1_id"],
            player2= data["player2_id"],
            game_name=data["game_name"],
            game_type="ranked",
            **tournament_data
        )
        game_obj.save()

        user1_data = getUserData(request, data["player1_id"])
        user2_data = getUserData(request, data["player2_id"])
        if (user1_data["status"] == "offline" or user2_data["status"] == "offline") and user1_data["status"] != user2_data["status"]:
            shouldSendNotification = False
            game_obj.has_ended = True
            game_obj.winner = user1_data["id"] if user2_data["status"] == "offline" else user2_data["id"]
            
            game_obj.player_1_score = 11 if user2_data["status"] == "offline" else 0
            game_obj.player_2_score = 11 if user1_data["status"] == "offline" else 0
            
            game_obj.save()
            update_stats_after_game(data["player1_id"], data["player2_id"], data["game_name"], game_obj)

        elif user1_data["status"] == "offline" and user2_data["status"] == "offline":
            shouldSendNotification = False
            game_obj.has_ended = True
            game_obj.winner = user1_data["id"]
            game_obj.player_1_score = 11
            game_obj.player_2_score = 0
            game_obj.save()
            update_stats_after_game(data["player1_id"], data["player2_id"], data["game_name"], game_obj)

        data["game_id"] = game_obj.id

        try:
            if shouldSendNotification:
                sendHTTPNotification(request, data)

            if not shouldSendNotification:
                sendAdvanceMatchRequest(request.COOKIES.get("access_token") , game_obj.id)


            return Response({
                "game_room_id": game_obj.id,
            }, status=status.HTTP_201_CREATED)
    
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while sending notification"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProfileStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        try:
            game_stats = {}
            game_stats["pong"] = GameStats.objects.get(user_id=pk, game_name="pong")
            game_stats["space_invaders"] = GameStats.objects.get(user_id=pk, game_name="space_invaders")
            game_stats["road_fighter"] = GameStats.objects.get(user_id=pk, game_name="road_fighter")

            TournamentProfileStats = getTournamentProfileStats(request, pk)
            
            response_data = {}
            for game in ["pong", "space_invaders", "road_fighter"]:
                response_data[game] = {
                    "match_numbers": {
                        "won": game_stats[game].games_won,
                        "lost": game_stats[game].games_lost,
                        "total": game_stats[game].total_games_played,
                    },
                    "win_los_ratio": {
                        "matches": round(game_stats[game].games_won / game_stats[game].total_games_played * 100, 2) if game_stats[game].total_games_played > 0 else 0,
                        "tournaments": TournamentProfileStats["win_los_ratio"][game],
                    },
                    "average": {
                        "avg_duration": int(game_stats[game].total_time_spent / game_stats[game].total_games_played) if game_stats[game].total_games_played > 0 else 0,
                        "avg_score": round(game_stats[game].total_score / game_stats[game].total_games_played, 2) if game_stats[game].total_games_played > 0 else 0,
                    }
                }
                
                all_player_games_objects = Game_History.objects.filter((Q(player1=pk) | Q(player2=pk)), game_name=game, has_ended=True).order_by('-game_date')
                response_data[game].update(generate_elo_graph(pk, all_player_games_objects, game_stats[game])),
                response_data[game]["current_elo"] = round(game_stats[game].current_elo, 2)
                response_data[game]["leaderboard_rank"] = GameStats.objects.filter(game_name=game, current_elo__gt=game_stats[game].current_elo).count() + 1
                response_data[game]["recent_games"] = ProfileGameHistorySerializer(all_player_games_objects, many=True).data
                response_data[game]["recent_tournaments"] = TournamentProfileStats["recent_tournaments"][game]
                
            return Response(response_data, status=status.HTTP_200_OK)
        except GameStats.DoesNotExist:
            return Response({"detail": "Stats Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while fetching the stats"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ResetStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            game_stats = {}
            game_stats["pong"] = GameStats.objects.get(user_id=pk, game_name="pong")
            game_stats["space_invaders"] = GameStats.objects.get(user_id=pk, game_name="space_invaders")
            game_stats["road_fighter"] = GameStats.objects.get(user_id=pk, game_name="road_fighter")

            for game in ["pong", "space_invaders", "road_fighter"]:
                game_stats[game].games_won = 0
                game_stats[game].games_lost = 0
                game_stats[game].games_drawn = 0
                game_stats[game].total_games_played = 0
                game_stats[game].current_elo = 25
                game_stats[game].total_score = 0
                game_stats[game].total_time_spent = 0
                game_stats[game].save()

            Game_History.objects.filter(Q(player1=pk) | Q(player2=pk)).delete()

            return Response({"message": "Stats Reset Successfully"}, status=status.HTTP_200_OK)
        except GameStats.DoesNotExist:
            return Response({"detail": "Stats Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while resetting the stats"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )