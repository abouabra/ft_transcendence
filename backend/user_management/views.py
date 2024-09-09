from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from .serializers import LoginSerializer
from .decorators import check_if_logged_in
from django.utils import timezone
from datetime import datetime
from .models import User

logger = logging.getLogger(__name__)


class IsAuthenticatedView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"detail": "You are authenticated"}, status=status.HTTP_200_OK)


class RefreshTokenView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:

                return Response(
                    {"detail": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            refresh = RefreshToken(refresh_token)
            refresh.check_blacklist()

            response = Response()
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                samesite="Strict",
                expires=datetime.fromtimestamp(refresh.access_token["exp"], tz=timezone.utc),
            )
            response.data = {"detail": "Token refreshed successfully"}
            response.status_code = status.HTTP_200_OK

            return response

        except Exception as e:
            response = Response({"detail": "Error encountered while refreshing the token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                username = request.data["username"]

                user = User.objects.get(username=username)

                refresh = RefreshToken.for_user(user)

                def set_expiration_date(epoch):
                    # return epoch - current_epoch
                    return datetime.fromtimestamp(epoch, tz=timezone.utc)

                response = Response()
                response.set_cookie(
                    key="refresh_token",
                    value=str(refresh),
                    httponly=True,
                    samesite="Strict",
                    expires=datetime.fromtimestamp(refresh["exp"], tz=timezone.utc),
                )
                response.set_cookie(
                    key="access_token",
                    value=str(refresh.access_token),
                    httponly=True,
                    samesite="Strict",
                    expires=datetime.fromtimestamp(refresh.access_token["exp"], tz=timezone.utc),
                )

                response.data = {
                    "detail": "Logged in successfully",
                }
                response.status_code = status.HTTP_200_OK

                return response
            except User.DoesNotExist:
                return Response(
                    {"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                logger.error(f"==============\n\n {str(e)} \n\n==============")
                return Response({"detail": "Error encountered while logging in"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request):
        return Response(
            self.serializer_class(request.user).data, status=status.HTTP_200_OK
        )

class SearchUsersView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def post(self, request):
        search_query = request.data.get("search_query")
        if search_query:
            users = User.objects.filter(username__icontains=search_query).order_by("username")[:5]
            return Response(self.serializer_class(users, many=True).data, status=status.HTTP_200_OK)

        return Response({"detail": "Search query is required"}, status=status.HTTP_400_BAD_REQUEST)