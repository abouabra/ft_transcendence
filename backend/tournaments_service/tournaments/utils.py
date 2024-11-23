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

    url = f"https://nginx-container/api/auth/user/{userID}/"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token}, verify=False)
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
    if (tournament.status == "Waiting for players"):
        tournament.status = "In progress"
        tournament.save()

    access_token = {"access_token":request.COOKIES.get("access_token")}
    matches = tournament.bracket_data[tournament.bracket_data["current_round"]]
    print(f"round = {tournament.bracket_data["current_round"]}")

    for match in matches:
        print(f"starting {match[0]} vs {match[1]}")

        # "isFakeMatch": True
        data = {
            "player1_id" : match[0],
            "player2_id": match[1],
            "game_name": tournament.game_name,
            "tournament_id": tournament.id,
            "tournament": ShortTournamentHistorySerializer(tournament).data}
        responce = requests.post("https://nginx-container/api/game/construct_tournament_game/", cookies=access_token,json=data, verify=False)

        if (responce.status_code >= 400):
            return 1
    return 0


def getmatchdata(request, game_id):
    access_token = {"access_token":request.COOKIES.get("access_token")}
    responce = requests.get(f"https://nginx-container/api/game/get_game_info/{game_id}", cookies=access_token, verify=False)
    data = responce.json()
    return data
