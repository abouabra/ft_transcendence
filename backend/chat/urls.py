from django.urls import path
from . import views

urlpatterns = [
    path('joined_servers/', views.JoinedServersView.as_view(), name='servers'),
    path('create_server/', views.CreateServerView.as_view(), name='create_server'),
    path('get_server_data/', views.GetServerDataView.as_view(), name='get_server_data'),
    path('get_message_data/', views.GetMessageDataView.as_view(), name='get_message_data'),
    path('get_serverlist/', views.GetServerListView.as_view(), name='get_serverlist'),
    path('server_info/', views.ServerInfoVisibility.as_view(), name='server_info'),
    path('server_JoinedData/', views.GetServerjoinedDataView.as_view(), name='server_JoinedData'),
    path('leave_server/', views.LeaverServer.as_view(), name='leave_server'),
    path('manage_user/', views.Serverusermanager.as_view(), name='Serverusermanager'),
    path('create_chat_room/<int:id>', views.CreateRoomView.as_view(), name="createroom"),
    

]