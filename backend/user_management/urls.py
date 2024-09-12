from django.urls import path
from . import views

urlpatterns = [
    path('is_authenticated/', views.IsAuthenticatedView.as_view(), name='is_authenticated'),
    

    path('token/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.RefreshTokenView.as_view(), name='token_refresh'),

    path('me/', views.MeView.as_view(), name='me'),
    path('search/', views.SearchUsersView.as_view(), name='search_users'),

    path('unread_notifications/', views.UnreadNotificationsView.as_view(), name='unread_notifications_count'),
    path('notifications_brief/', views.NotificationsBriefView.as_view(), name='notifications_brief'),
    path('notifications/', views.NotificationsView.as_view(), name='notifications'),
]