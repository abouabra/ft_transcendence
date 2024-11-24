
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/game_service/', admin.site.urls),
    path('api/game/', include('game.urls')),
]
