# authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        if request.resolver_match.url_name == 'token_refresh':
            return None

        # Check if the token is in cookies
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        except InvalidToken:
            raise AuthenticationFailed("Invalid or expired token")