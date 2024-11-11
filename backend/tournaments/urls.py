from django.urls import path
from . import views

urlpatterns = [
    path('create_tournament_stats/<int:user_id>/', views.CreateTournamentStatsView.as_view(), name='create_tournament_stats'),
    path('delete_tournament_stats/<int:user_id>/', views.DeleteTournamentStatsView.as_view(), name='delete_tournament_stats'),
    
    path("home_active_tournaments/", views.HomeActiveTournamentsView.as_view(), name="home_active_tournaments"),

    path("home_expanded_active_tournaments/", views.HomeExpandedActiveTournamentsView.as_view(), name="home_expanded_active_tournaments"),


    path("generate/", views.GenerateRandomTournamentHistoryData.as_view(), name="generate"),


    path("get_tournament_info/<int:pk>", views.GetTournamentInfo.as_view(), name="get_tournament_info"),
]