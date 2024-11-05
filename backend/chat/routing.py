from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"chat/(?P<room_name>\w+)$", consumers.ChatConsumer.as_asgi()),
    re_path(r"chat/userpermition/(?P<room_name>\w+)$", consumers.ChatConsumerUserPermition.as_asgi()),
]
