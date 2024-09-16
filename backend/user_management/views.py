from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, NotificationSerializer, ShortUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from .serializers import LoginSerializer
from .decorators import check_if_logged_in
from django.utils import timezone
from datetime import datetime
from .models import User, Notification
from rest_framework.pagination import PageNumberPagination

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
                expires=datetime.fromtimestamp(
                    refresh.access_token["exp"], tz=timezone.utc
                ),
            )
            response.data = {"detail": "Token refreshed successfully"}
            response.status_code = status.HTTP_200_OK

            return response

        except Exception as e:
            response = Response(
                {"detail": "Error encountered while refreshing the token"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
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
                user.status = "online"
                user.save()

                refresh = RefreshToken.for_user(user)

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
                    expires=datetime.fromtimestamp(
                        refresh.access_token["exp"], tz=timezone.utc
                    ),
                )

                response.data = {"detail": "Logged in successfully"}
                response.status_code = status.HTTP_200_OK

                return response
            except User.DoesNotExist:
                return Response(
                    {"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                logger.error(f"==============\n\n {str(e)} \n\n==============")
                return Response(
                    {"detail": "Error encountered while logging in"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request):
        return Response(
            self.serializer_class(request.user).data, status=status.HTTP_200_OK
    )

class UserView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            return Response(self.serializer_class(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while fetching the user"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class SearchUsersView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def post(self, request):
        search_query = request.data.get("search_query")
        if search_query:
            users = User.objects.filter(username__icontains=search_query).order_by(
                "username"
            )[:5]
            return Response(
                self.serializer_class(users, many=True).data, status=status.HTTP_200_OK
            )

        return Response(
            {"detail": "Search query is required"}, status=status.HTTP_400_BAD_REQUEST
        )


class NotificationsBriefView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer

    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user).order_by("-timestamp")[:5]

        unread_notifications = 0

        for notification in notifications:
            if not notification.is_read:
                unread_notifications += 1
            notification.is_read = True
            notification.save()

        serialized_notifications = self.serializer_class(notifications, many=True).data
        total_unread_notifications = Notification.objects.filter(receiver=request.user, is_read=False).count()

        return Response({
            "notifications": serialized_notifications,
            "total_unread_notifications": total_unread_notifications,
            "unread_notifications": unread_notifications
        }, status=status.HTTP_200_OK)

class UnreadNotificationsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        unread_notifications = Notification.objects.filter(receiver=request.user, is_read=False).count()
        return Response({
            "unread_notifications": unread_notifications
        }, status=status.HTTP_200_OK)


class NotificationsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 10

    def get(self, request):
        paginator = self.pagination_class()
        notifications = Notification.objects.filter(receiver=request.user).order_by(
            "-timestamp"
        )
        result_page = paginator.paginate_queryset(notifications, request)
        serialized_notifications = self.serializer_class(result_page, many=True).data
        return paginator.get_paginated_response(serialized_notifications)


class FriendsBarView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request):
        friends = request.user.friends.filter(status="online")

        PLAYING_CHOICES = (
            (None, None),
            ("pong", "Pong"),
            ("space_invaders", "Space Invaders"),
            ("road_fighter", "Road Fighter"),
        )


        data = self.serializer_class(friends, many=True).data
        for i in range(len(data)):
            for j in range(len(PLAYING_CHOICES)):
                if friends[i].is_playing == PLAYING_CHOICES[j][0]:
                    data[i]["is_playing"] = PLAYING_CHOICES[j][1]
                    break



        # i want to order them, the ones who playing (aka who have is_playing != None) then the rest
        data.sort(key=lambda x: x["is_playing"] is not None, reverse=True)

         
        return Response (data, status=status.HTTP_200_OK)