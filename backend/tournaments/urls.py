from django.urls import path
from . import views

urlpatterns = [
    path('create_tournament_stats/<int:user_id>/', views.CreateTournamentStatsView.as_view(), name='create_tournament_stats'),
    path('delete_tournament_stats/<int:user_id>/', views.DeleteTournamentStatsView.as_view(), name='delete_tournament_stats'),
    
    path("home_active_tournaments/", views.HomeActiveTournamentsView.as_view(), name="home_active_tournaments"),

    path("home_expanded_active_tournaments/", views.HomeExpandedActiveTournamentsView.as_view(), name="home_expanded_active_tournaments"),

    path("TournamentsData/", views.GetTournamentsData.as_view(), name="getTournamentsData"),
    path("Tournamentjoin/",views.GetTournamentroomData.as_view(),name="getTournamentroomData"),
    path("Tournamentcreate/",views.CreateTournamentroom.as_view(),name="createTournamentroomData"),
    
    path("generate/", views.GenerateRandomTournamentHistoryData.as_view(), name="generate"),
]