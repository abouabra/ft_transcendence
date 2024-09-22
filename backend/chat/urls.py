from django.urls import path
from . import views

urlpatterns = [
    path('joined_servers/', views.JoinedServersView.as_view(), name='servers'),
    path('create_server/', views.ChatBarDataViews.as_view(), name='create_server'),
]