import logging
import requests
from .models import Tournament_History
from .serializers import ShortTournamentHistorySerializer
import time
def getUserData(request, userID):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"http://127.0.0.1:8000/api/auth/user/{userID}/"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token})
    return response.json()

def find_emty_room(matchs):
    lent = len(matchs)
    i = 0
    while i < lent:
        if (matchs[i][0] == 0):
            return [i,0]
        elif matchs[i][1] == 0:
            return [i,1]
        i += 1
    return None

def Start_Playing(request, tournament):
    if (tournament.status != "Waiting for players"):
        time.sleep(3)
    access_token = {"access_token":request.COOKIES.get("access_token")}
    matches = tournament.bracket_data[tournament.bracket_data["current_round"]]
    print(f"bada {tournament.bracket_data[tournament.bracket_data["current_round"]]} round = {tournament.bracket_data["current_round"]}")

    for match in matches:
        print(f"starting {match[0]} vs {match[1]}")

        # "isFakeMatch": True
        data = {
            "player1_id" : match[0],
            "player2_id": match[1],
            "game_name": tournament.game_name,
            "tournament_id": tournament.id,
            "tournament": ShortTournamentHistorySerializer(tournament).data}
        responce = requests.post("http://127.0.0.1:8000/api/game/construct_tournament_game/", cookies=access_token,json=data)
        # if (tournament.bracket_data["current_round"] == "finals"):
        #     request.data["game_id"] = responce.json()["game_room_id"]
        #     gameresult = getmatchdata(request)

        #     tournament.tournament_winner = gameresult["winner"]
        #     tournament.status = "Ended"
        #     tournament.save()
        #     break
        print(responce.json())
        if (responce.status_code > 300):
            return 0
        game_id = responce.json()["game_room_id"]
    return game_id

def getmatchdata(request, game_id):
    access_token = {"access_token":request.COOKIES.get("access_token")}
    responce = requests.get(f"http://127.0.0.1:8000/api/game/get_game_info/{game_id}", cookies=access_token)
    data = responce.json()
    return data
