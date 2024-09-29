import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import game.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

default_asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": default_asgi_application,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                game.routing.websocket_urlpatterns
            )
        )
    )
})
