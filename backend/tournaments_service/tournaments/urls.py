from django.urls import path
from . import views

urlpatterns = [
    path('create_tournament_stats/<int:user_id>/', views.CreateTournamentStatsView.as_view(), name='create_tournament_stats'),
    path('delete_tournament_stats/<int:user_id>/', views.DeleteTournamentStatsView.as_view(), name='delete_tournament_stats'),
    
    path("home_active_tournaments/", views.HomeActiveTournamentsView.as_view(), name="home_active_tournaments"),

    path("home_expanded_active_tournaments/", views.HomeExpandedActiveTournamentsView.as_view(), name="home_expanded_active_tournaments"),

    path("TournamentsData/", views.GetTournamentsData.as_view(), name="getTournamentsData"),
    path("tournament_rooms/",views.GetTournamentroomData.as_view(),name="getTournamentroomData"),
    path("Tournamentcreate/",views.CreateTournamentroom.as_view(),name="createTournamentroomData"),
    path("joinedusertournament/",views.TournamentjoinedUsers.as_view(),name="TournamentjoinedUsers"),
    path("generate/", views.GenerateRandomTournamentHistoryData.as_view(), name="generate"),
    path("tournamentmembers/", views.Membertournament.as_view(), name="Membertournament"),
    path("testplaying/", views.testplaying.as_view(), name="testplaying"),
    path("advancematch/", views.advanceTournamentmatch.as_view(), name="advancematch"),
    path("get_tournament_info/<int:pk>", views.GetTournamentInfo.as_view(), name="get_tournament_info"),

    path("profile_stats/<int:pk>/", views.ProfileStatsView.as_view(), name="profile_stats"),
    
    path("get_user_nickname/", views.GetTournamentUserNickname.as_view(), name="get_user_nickname"),
]