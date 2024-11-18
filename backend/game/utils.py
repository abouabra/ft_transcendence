import logging
import requests
from .models import GameStats, Game_History


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
        url = f"http://127.0.0.1:8000/api/auth/user/{userID}/"
    elif username:
        url = f"http://127.0.0.1:8000/api/auth/user_username/{username}/"
    else:
        raise ValueError("Either userID or username must be provided")

    response = requests.get(url, headers=request_headers, cookies=cookies)
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


def update_stats_after_game(player_1_id, player_2_id, game_name, game_id):
    print(f"update_stats_after_game: {player_1_id} vs {player_2_id} in {game_name}")
    player_1_stats = GameStats.objects.get(user_id=player_1_id, game_name=game_name)
    player_2_stats = GameStats.objects.get(user_id=player_2_id, game_name=game_name)
    
    match_obj = Game_History.objects.get(id=game_id)

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

    player_1_new_elo, player_2_new_elo = ELO_System(player_1_stats.current_elo, player_2_stats.current_elo, match_obj.player_1_score, match_obj.player_2_score, 32)

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

    url = f"http://127.0.0.1:8000/api/auth/recieve_http_notification/"


    response = requests.post(url, headers=request_headers, cookies={"access_token": access_token}, json=jsonData)
    
    if(response.status_code != 200):
        raise ValueError("Failed to send HTTP Notification")
    
    return response.json()




def sendAdvanceMatchRequest(access_token, game_id):    

    print(f"sendAdvanceMatchRequest: game_id = {game_id}")
    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    cookies = {"access_token": access_token}

    url = f"http://127.0.0.1:8000/api/tournaments/advancematch/"

    response = requests.post(url, headers=request_headers, cookies=cookies, json={"game_id": game_id})
    return response.json()

