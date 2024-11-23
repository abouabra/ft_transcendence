import logging
import requests


def getUserData(request, userID, full_user=False):
    access_token = request.COOKIES.get("access_token")

    request_headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if full_user:
        url = f"https://nginx-container/api/auth/full_user/{userID}/"
    else:
        url = f"https://nginx-container/api/auth/user/{userID}/"

    response = requests.get(url, headers=request_headers, cookies={"access_token": access_token}, verify=False)
    return response.json()