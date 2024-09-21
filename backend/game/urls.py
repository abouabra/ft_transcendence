from django.urls import path
from . import views

urlpatterns = [
    path('home_leaderboard/', views.HomeLeaderboardView.as_view(), name='home_leaderboard'),
    path('create_game_stats/<int:user_id>/', views.CreateGameStatsView.as_view(), name='create_game_stats'),
]