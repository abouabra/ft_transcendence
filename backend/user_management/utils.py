import logging
import requests
import json
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


def create_qr_code(image="./assets/images/qrcode_2fa/qrcode.png", qr_data="empty", name="default.jpg"):

    image_url = "https://api.qrcode-monkey.com/qr/uploadImage"
    url_qr = "https://api.qrcode-monkey.com/qr/custom"
    image_name = name
    image_extention = name.split('.')[-1]
    with open(f".{image}", "rb") as img:
        files = {'file': img}
        response_img = requests.post(image_url, files=files)
    response_string = response_img.content
    my_file = json.loads(response_string.decode('utf-8'))
    image = my_file['file']

    data = {
        "data": qr_data,
        "config": {
            "body": "circle-zebra-vertical",
            "eye": "frame2",
            "eyeBall": "ball2",
            "erf1": ["fh"],
            "erf2": [],
            "erf3": [],
            "brf1": [],
            "brf2": [],
            "brf3": [],
            "bodyColor": "#000000",
            "bgColor": "#FFFFFF",
            "eye1Color": "#000000",
            "eye2Color": "#000000",
            "eye3Color": "#000000",
            "eyeBall1Color": "#000000",
            "eyeBall2Color": "#000000",
            "eyeBall3Color": "#000000",
            "gradientColor1": "#D64B3A",
            "gradientColor2": "#571B14",
            "gradientType": "linear",
            "gradientOnEyes": True,
            "logo": image,
            "logoMode": "clean"
        },
        "size": 512,
        "download": False,
        "file": image_extention
    }

    json_string = json.dumps(data)
    response_qr = requests.post(url_qr, data=json_string)
    if response_qr.status_code == 200:
        with open(f"./assets/images/qrcode_2fa/{image_name}", "wb") as file:
            file.write(response_qr.content)
