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