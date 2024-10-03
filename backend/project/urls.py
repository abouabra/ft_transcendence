
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('user_management.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/game/', include('game.urls')),
    path('api/tournaments/', include('tournaments.urls')),
]
