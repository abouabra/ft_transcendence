from django.urls import path
from .views import Account, Home, CustomTokenObtainPairView, VerificationEmail, SendEmailView

urlpatterns = [
    path('signup/', Account.as_view(), name='Account'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('verification_email/', VerificationEmail.as_view(), name='verification_email'),
    path('send-email/', SendEmailView.as_view(), name='send_email'),
    path('', Home.as_view())
]