import requests
import json
import os


def create_qr_code(image="./assets/images/server_avatars/default.jpg", qr_data="empty", name="default.jpg"):

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
        with open(f"./assets/images/servers_qr_codes/{image_name}", "wb") as file:
            file.write(response_qr.content)


