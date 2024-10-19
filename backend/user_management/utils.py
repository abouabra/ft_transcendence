import logging
import requests

logger = logging.getLogger(__name__)

def init_user_stats(request, userID):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"http://127.0.0.1:8000/api/game/create_game_stats/{userID}/"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token})
    if(response.status_code != 201):
        raise Exception("Error encountered while creating game stats")
    
    url = f"http://127.0.0.1:8000/api/tournaments/create_tournament_stats/{userID}/"
    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token})
    if(response.status_code != 201):
        raise Exception("Error encountered while creating tournament stats")
