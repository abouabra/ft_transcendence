from django.urls import path
from . import views

urlpatterns = [
    path('joined_servers/', views.JoinedServersView.as_view(), name='servers'),
    path('create_server/', views.CreateServerView.as_view(), name='create_server'),
    path('get_server_data/', views.GetServerDataView.as_view(), name='get_server_data'),
    path('get_message_data/', views.GetMessageDataView.as_view(), name='get_message_data'),
    path('setmessage/', views.SetMessageView.as_view(), name='setmessage'),
    path("msg/<str:room_name>/", views.roomview.as_view(), name="room"),

]