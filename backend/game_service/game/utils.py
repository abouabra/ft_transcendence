import logging
import requests
from .models import GameStats, Game_History


logger = logging.getLogger(__name__)

def getUserData(request, userID=None, username=None, noAccessToken=False):
    
    if not noAccessToken:
        access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    cookies = {}
    if not noAccessToken:
        cookies = {"access_token": access_token}

    if userID:
        url = f"https://nginx-container/api/auth/user/{userID}/"
    elif username:
        url = f"https://nginx-container/api/auth/user_username/{username}/"
    else:
        raise ValueError("Either userID or username must be provided")

    response = requests.get(url, headers=request_headers, cookies=cookies, verify=False)
    return response.json()



def ELO_System(RatingA, RatingB, ResultA, ResultB, K):
    def expected(A, B):
        return 1 / (1 + 10 ** ((B - A) / 400))

    def update_rating(RatingA, RatingB, ScoreA, ScoreB, K):
        EA = expected(RatingA, RatingB)
        EB = expected(RatingB, RatingA)
        
        if ScoreA > ScoreB:
            ResultA, ResultB = 1, 0
        elif ScoreA < ScoreB:
            ResultA, ResultB = 0, 1
        else:
            ResultA, ResultB = 0.5, 0.5
        
        score_diff = abs(ScoreA - ScoreB)
        if ScoreA > ScoreB:
            ResultA += score_diff / 10
            ResultB -= score_diff / 10
        else:
            ResultA -= score_diff / 10
            ResultB += score_diff / 10


        ResultA = min(max(ResultA, 0), 1)
        ResultB = min(max(ResultB, 0), 1)


        newRatingA = RatingA + K * (ResultA - EA)
        newRatingB = RatingB + K * (ResultB - EB)

        return newRatingA, newRatingB
    
    player1, player2 = update_rating(RatingA, RatingB, ResultA, ResultB, K)

    if player1 < 0:
        player1 = 0
    if player2 < 0:
        player2 = 0

    return int(player1), int(player2)


def update_stats_after_game(player_1_id, player_2_id, game_name, match_obj):
    logger.error(f"update_stats_after_game: {player_1_id} vs {player_2_id} in {game_name}")
    player_1_stats = GameStats.objects.get(user_id=player_1_id, game_name=game_name)
    player_2_stats = GameStats.objects.get(user_id=player_2_id, game_name=game_name)
    

    if match_obj.winner == player_1_id:
        player_1_stats.games_won += 1
        player_2_stats.games_lost += 1

    elif match_obj.winner == player_2_id:
        player_2_stats.games_won += 1
        player_1_stats.games_lost += 1
    else:
        player_1_stats.games_drawn += 1
        player_2_stats.games_drawn += 1
    
    player_1_stats.total_games_played += 1
    player_2_stats.total_games_played += 1
    
    logger.error("\n\n\n")
    logger.error(f"update_stats_after_game: {player_1_id} vs {player_2_id} on {game_name} result {match_obj.player_1_score} : {match_obj.player_2_score}")
    player_1_new_elo, player_2_new_elo = ELO_System(player_1_stats.current_elo, player_2_stats.current_elo, match_obj.player_1_score, match_obj.player_2_score, 32)
    logger.error("\n\n\n")
    logger.error(f"update_stats_after_game: {player_1_id} current_elo: {player_1_stats.current_elo} new ELO: {player_1_new_elo}")
    logger.error(f"update_stats_after_game: {player_2_id} current_elo: {player_2_stats.current_elo} new ELO: {player_2_new_elo}")
    logger.error("\n\n\n")

    match_obj.player1_elo_change = player_1_new_elo - player_1_stats.current_elo
    match_obj.player2_elo_change = player_2_new_elo - player_2_stats.current_elo

    player_1_stats.current_elo = player_1_new_elo
    player_2_stats.current_elo = player_2_new_elo

    player_1_stats.total_score += match_obj.player_1_score
    player_2_stats.total_score += match_obj.player_2_score

    player_1_stats.total_time_spent += match_obj.game_duration
    player_2_stats.total_time_spent += match_obj.game_duration

    player_1_stats.save()
    player_2_stats.save()
    match_obj.save()


def sendHTTPNotification(request, jsonData):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = "https://nginx-container/api/auth/recieve_http_notification/"


    response = requests.post(url, headers=request_headers, cookies={"access_token": access_token}, json=jsonData, verify=False)
    logger.error(f"\n\nsendHTTPNotification \n\njsonData: {jsonData} \n\n {response.json()}\n\n")

    if(response.status_code != 200):
        raise ValueError("Failed to send HTTP Notification")
    
    return response.json()




def sendAdvanceMatchRequest(access_token, game_id):    

    logger.error(f"sendAdvanceMatchRequest: game_id = {game_id}")
    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    cookies = {"access_token": access_token}

    url = f"https://nginx-container/api/tournaments/advancematch/"

    response = requests.post(url, headers=request_headers, cookies=cookies, json={"game_id": game_id}, verify=False)
    return response.json()



def getTournamentProfileStats(request, userID):
    access_token = request.COOKIES.get("access_token")
    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"https://nginx-container/api/tournaments/profile_stats/{userID}/"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token}, verify=False)

    if(response.status_code != 200):
        raise Exception(f"Error encountered while fetching profile stats {response.text}")

    return response.json()

def generate_elo_graph(userID, all_player_games_objects, game_stats):
    try:
        data = []
        loop_elo = game_stats.current_elo
        

        for game in all_player_games_objects:
            elo_change = game.player1_elo_change if game.player1 == userID else game.player2_elo_change
            
            game_date = int(game.game_date.timestamp())

            data.append({"match_id": game.id, "elo": loop_elo, "date": game_date})
            loop_elo -= elo_change
            loop_elo = max(loop_elo, 0)

        data.append({"match_id": "account_creation", "elo": 25, "date": int(game_stats.created_at.timestamp())})

        data.reverse()


        return {"elo_graph": data}
    except Exception as e:
        logging.error(f"====\nError in generate_elo_graph: {e}\n====")
        return {"elo_graph": []}

def setUserToPlaying(access_token, userID, game_name):
    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"https://nginx-container/api/auth/set_user_playing_game/"
    data = {
        "user_id": userID,
        "game_name": game_name
    }

    response = requests.post(url, headers=request_headers, cookies={"access_token": access_token}, json=data, verify=False)

    if(response.status_code != 200):
        raise Exception(f"Error encountered while fetching profile stats {response.text}")

    return response.json()



def getTournamentUserNickname(request, userID, TournamentID):
    access_token = request.COOKIES.get("access_token")
    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"https://nginx-container/api/tournaments/get_user_nickname/?user_id={userID}&tournament_id={TournamentID}"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token}, verify=False)

    if(response.status_code != 200):
        raise Exception(f"Error encountered while fetching profile stats {response.text}")

    return response.json()


