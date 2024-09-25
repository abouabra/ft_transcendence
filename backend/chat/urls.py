from django.urls import path
from . import views

urlpatterns = [
    path('joined_servers/', views.JoinedServersView.as_view(), name='servers'),
    path('create_server/', views.CreateServerView.as_view(), name='create_server'),
    path('get_server_data/', views.GetServerDataView.as_view(), name='get_server_data'),
]