from django.urls import path
from . import views

urlpatterns = [  
    path('is_authenticated/', views.IsAuthenticatedView.as_view(), name='is_authenticated'),

    path('token/refresh/', views.RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='token_obtain_pair'),

    path('me/', views.MeView.as_view(), name='me'),
    path('user/<int:pk>/', views.UserView.as_view(), name='user'),
    path('user_username/<str:username>/', views.UserByUserNameView.as_view(), name='user'),
    path('full_user/<int:pk>/', views.FullUserView.as_view(), name='user'),
    path('search/', views.SearchUsersView.as_view(), name='search_users'),

    path('unread_notifications/', views.UnreadNotificationsView.as_view(), name='unread_notifications_count'),
    path('delete_notifications/<int:pk>/', views.DeleteNotificationView.as_view(), name='delete_notification'),
    
    path('notifications_brief/', views.NotificationsBriefView.as_view(), name='notifications_brief'),
    path('notifications/', views.NotificationsView.as_view(), name='notifications'),
    path('friends_bar/', views.FriendsBarView.as_view(), name='friends_bar'),

    path('accept_friend_request/<int:pk>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),
    path('remove_friend/<int:pk>/', views.RemoveFriendView.as_view(), name='remove_friend'),

    path('recieve_http_notification/', views.RecieveHttpNotification.as_view(), name='recieve_http_notification'),
    path('signup/', views.Account.as_view(), name='Account'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('verification_email/', views.VerificationEmail.as_view(), name='verification_email'),
    path('send-email/', views.SendEmailView.as_view(), name='send_email'),
    path('forgot_password/', views.Forgot_password.as_view(), name='forgot_pass'),
    path('verify_2fa/', views.VerifyTwoFactorAuthView.as_view(), name='two_factor_auth'),
    path('update_2fa/', views.SetupTwoFactorAuthView.as_view(), name='two_factor_auth'),
    path('after_google/', views.get_user_data, name='after_google'),
    path('callback/', views.intra_42_callback, name='callback'),
    path('user_info/', views.user_info.as_view(), name='user_info'),

    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),
]
