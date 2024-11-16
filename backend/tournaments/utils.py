import logging
import requests
from .models import Tournament_History
from .serializers import ShortTournamentHistorySerializer
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

def Start_Playing(request, tournament_id):
    access_token = {"access_token":request.COOKIES.get("access_token")}

    try:
        tournament = Tournament_History.objects.get(id=tournament_id)
        data = {}
        data["player1_id"] = tournament.members[0]
        data["player2_id"] = tournament.members[1]
        data["game_name"] = tournament.game_name
        data["tournament"] = ShortTournamentHistorySerializer(tournament).data
        responce = requests.post("http://127.0.0.1:8000/api/game/construct_tournament_game/", cookies=access_token,json= data)
        print("game retun value to playing game")
        print("game retun value to playing game")
        print("game retun value to playing game")
        print(responce)
        print(responce.json())
        print(responce.text)
    except Tournament_History.DoesNotExist:
        return "Tournament not found"