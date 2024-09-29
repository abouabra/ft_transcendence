# authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
import requests
import logging

logger = logging.getLogger(__name__)

class ProxyUser:
    def __init__(self, user_data):
        self.id = user_data.get("id")
        self.username = user_data.get("username")
        self.email = user_data.get("email")
        self.is_authenticated = True  # Always true for valid tokens

    @property
    def is_active(self):
        # You can add additional logic here if needed
        return True

    def __str__(self):
        return self.username


class UserManagementJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get("access_token")

        if not token:
            return None  # No token provided

        try:
            # Send the token to the user_management_service for validation
            response = requests.post("http://user_management_container:8000/api/auth/verify_token/", data={"token": token})

            if response.status_code != 200:
                raise AuthenticationFailed("Invalid token")

            user_data = response.json()

            proxy_user = ProxyUser(user_data)

            return (proxy_user, token)

        except Exception as e:
            raise e
