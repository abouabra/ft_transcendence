from django.urls import path
from . import views

urlpatterns = [
    path('create_game_stats/<int:user_id>/', views.CreateGameStatsView.as_view(), name='create_game_stats'),
    path('home_leaderboard/', views.HomeLeaderboardView.as_view(), name='home_leaderboard'),
    path('home_total_time/', views.HomeTotalTimeView.as_view(), name='home_total_time'),

    path("home_active_games/", views.HomeActiveGamesView.as_view(), name="home_active_games"),
    path("home_expanded_active_games/", views.HomeExpandedActiveGamesView.as_view(), name="home_expanded_active_games"),
    
    path("construct_local_game/", views.ConstructLocalGameHistoryData.as_view(), name="construct_game"),
    path("get_game_info/<int:pk>", views.GetGameInfo.as_view(), name="get_game_info"),
    
    
    
    
    path("generate/", views.GenerateRandomGameHistoryData.as_view(), name="generate"),
]