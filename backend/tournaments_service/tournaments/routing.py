from django.urls import re_path
from .consumers import TournamentConsumer

websocket_urlpatterns = [
    
    re_path(r"ws/tournaments/(?P<room_name>\w+)$", TournamentConsumer.as_asgi()),
]
