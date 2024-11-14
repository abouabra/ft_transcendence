import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

import user_management.routing
import game.routing
import chat.routing
import tournaments.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

default_asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": default_asgi_application,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(chat.routing.websocket_urlpatterns
                      + user_management.routing.websocket_urlpatterns 
                      + game.routing.websocket_urlpatterns
                      + tournaments.routing.websocket_urlpatterns)
        )
    )
})
