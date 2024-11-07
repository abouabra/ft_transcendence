import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def init_user_stats(request, userID):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"http://127.0.0.1:8000/api/game/create_game_stats/{userID}/"

    response = requests.post(url, headers=request_headers, cookies={"access_token": access_token})
    if(response.status_code == 200):
        return

    if(response.status_code != 201):
        raise Exception(f"Error encountered while creating game stats {response.text}")
    
    url = f"http://127.0.0.1:8000/api/tournaments/create_tournament_stats/{userID}/"
    response = requests.post(url, headers=request_headers, cookies={"access_token": access_token})
    if(response.status_code != 201):
        raise Exception("Error encountered while creating tournament stats")

def delete_user_stats(request, userID):
    access_token = request["COOKIES"].get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    url = f"http://127.0.0.1:8000/api/game/delete_game_stats/{userID}/"

    response = requests.delete(url, headers=request_headers, cookies={"access_token": access_token})
   
    if(response.status_code != 204):
        raise Exception(f"Error encountered while deleting game stats {response.text}")
    
    url = f"http://127.0.0.1:8000/api/tournaments/delete_tournament_stats/{userID}/"
    response = requests.delete(url, headers=request_headers, cookies={"access_token": access_token})
    if(response.status_code != 204):
        raise Exception("Error encountered while deleting tournament stats")


def set_refresh_and_access_token(response, tokens = None):
    access_token_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
    
    if not tokens:
        access_token = response.data.pop("access", None)
        refresh_token = response.data.pop("refresh", None)
    else:
        access_token, refresh_token = tokens
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="Strict",
        max_age=int(refresh_token_lifetime.total_seconds())
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="Strict",
        max_age=int(access_token_lifetime.total_seconds())
    )
