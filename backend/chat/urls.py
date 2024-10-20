from django.urls import path
from . import views

urlpatterns = [
    path('joined_servers/', views.JoinedServersView.as_view(), name='servers'),
    path('create_server/', views.CreateServerView.as_view(), name='create_server'),
    path('get_server_data/', views.GetServerDataView.as_view(), name='get_server_data'),
    path('get_message_data/', views.GetMessageDataView.as_view(), name='get_message_data'),
    path('get_serverlist/', views.GetServerListView.as_view(), name='get_serverlist'),
    path('server_info/', views.ServerInfo.as_view(), name='server_info'),
    
]