import logging
import requests


def getUserData(request, userID=None, username=None):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if userID:
        url = f"http://127.0.0.1:8000/api/auth/user/{userID}/"
    elif username:
        url = f"http://127.0.0.1:8000/api/auth/user_username/{username}/"
    else:
        raise ValueError("Either userID or username must be provided")

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token})
    return response.json()


def generate_id(uid1, uid2, game_name):
    sorted_uids = sorted([uid1, uid2])
    return f"{game_name}-{sorted_uids[0]}-{sorted_uids[1]}"
