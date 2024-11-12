import logging
import requests


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