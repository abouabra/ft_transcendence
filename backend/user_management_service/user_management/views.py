from . import utils
from .models import User
from .models import User, Notification
from .serializers import SerializerSignup, ValidEmail
from .serializers import UserSerializer, NotificationSerializer, ShortUserSerializer, ProfileUserSerializer
from .utils import set_refresh_and_access_token, init_user_stats, create_qr_code, getProfileStats, delete_user_stats
from datetime import datetime, timezone
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.http import  HttpResponseRedirect
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
import base64, hmac, hashlib, urllib.parse
import logging
import pyotp
import qrcode
import requests
import secrets
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from social_django.models import UserSocialAuth


logger = logging.getLogger(__name__)


class IsAuthenticatedView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"detail": "You are authenticated"}, status=status.HTTP_200_OK)


class VerifyToken(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ShortUserSerializer

    def post(self, request):
        try:
            token = request.data.get("token")
            if not token:
                return Response(
                    {"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
                )

            access_token = AccessToken(token)

            user = User.objects.get(id=access_token["user_id"])

            return Response(self.serializer_class(user).data, status=status.HTTP_200_OK)

        except Exception as e:

            return Response(
                {"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )



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


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            username = request.data.get('username')
            try:
                user = User.objects.get(username = username)
            except:
                return Response({"error":"User not found"}, status=404)
            if not user.two_factor_auth:
                utils.set_refresh_and_access_token(response)
            response.data["user_is_auth"] = user.two_factor_auth
            return response
        except Exception as e:
            print(f"Error occurred: {e}")
            return Response({"error": str(e)},status=status.HTTP_401_UNAUTHORIZED)



class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            refresh = RefreshToken(refresh_token)
            refresh.blacklist()

            response = Response()
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            response.data = {"detail": "Logged out successfully"}
            response.status_code = status.HTTP_200_OK

            user = User.objects.get(id=request.user.id)
            user.status = "offline"
            user.save()

            return response

        except Exception as e:
            response = Response(
                {"detail": "Error encountered while logging out"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response


class MeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request):
        return Response(
            self.serializer_class(request.user).data, status=status.HTTP_200_OK
    )

    def delete(self, request):
        try:
            user = User.objects.get(id=request.user.id)
            
            UserSocialAuth.objects.filter(user=user, provider='google-oauth2').delete()

            delete_user_stats(request, user.id)
            avatar_disk_path = str(settings.BASE_DIR) + user.avatar
            if os.path.exists(avatar_disk_path) and user.avatar.startswith("/assets/images/avatars/") and user.avatar != "/assets/images/avatars/default.jpg":
                print(f"Deleting {user.id} avatar: {avatar_disk_path}")
                os.remove(avatar_disk_path)
            profile_banner_disk_path = str(settings.BASE_DIR) + user.profile_banner
            if os.path.exists(profile_banner_disk_path) and user.profile_banner.startswith("/assets/images/banners/") and user.profile_banner != "/assets/images/banners/default_banner.png":
                print(f"Deleting {user.id} profile banner: {profile_banner_disk_path}")
                os.remove(profile_banner_disk_path)

            user.friends.clear()
            user.blocked.clear()
            user.username = f"deleted_{user.id}"
            user.email = f"deleted_{user.id}@fesablanca.com"
            user.is_active = False
            user.avatar = "/assets/images/avatars/default.jpg"
            user.profile_banner = "/assets/images/banners/default_banner.png"
            user.status = "deleted"
            user.two_factor_auth = False
            user.otp_secret = ""
            user.is_playing = None
            user.save()


            Notification.objects.filter(receiver=user).delete()
            Notification.objects.filter(sender=user).delete()

            resonse = Response({"detail": "User deleted successfully"}, status=status.HTTP_200_OK)
            resonse.delete_cookie("access_token")
            resonse.delete_cookie("refresh_token")
            return resonse

        except User.DoesNotExist:
            resonse = Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
            resonse.delete_cookie("access_token")
            resonse.delete_cookie("refresh_token")
            return resonse

        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            response = Response(
                {"detail": "Error encountered while deleting the user"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            
            return Response

class UserView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ShortUserSerializer
    
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
        
class UserByUserNameView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
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

class FullUserView(generics.GenericAPIView):
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
            users = User.objects.filter(username__icontains=search_query, is_staff=False).order_by("username")[:5]
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

class DeleteNotificationView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk)
            notification.delete()
            return Response({"detail": "Notification deleted successfully"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while deleting the notification"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomPagination(PageNumberPagination):
    page_size = 10 
class NotificationsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer
    pagination_class = CustomPagination
    queryset = Notification.objects.all()

    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user, type__in=["game_invitation", "friend_request", "strike"]).order_by("-timestamp")
        page = self.paginate_queryset(notifications)
        if page is not None:
            unread_notifications = 0
            serialized_notifications = self.serializer_class(page, many=True).data
            for notification in page:
                if not notification.is_read:
                    unread_notifications += 1
                notification.is_read = True
                notification.save()
            response = self.get_paginated_response(serialized_notifications)
            response.data["unread_notifications"] = unread_notifications
            return response

        serialized_notifications = self.serializer_class(notifications, many=True).data
        return Response(serialized_notifications, status=status.HTTP_200_OK)



class FriendsBarView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request):
        friends = request.user.friends.all()
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



        # i want to order them, the ones who playing (aka who have is_playing != None) then the status="online" then rest
        data.sort(key=lambda x: (x["is_playing"] is not None, x["status"] == "online"), reverse=True)
         
        return Response (data, status=status.HTTP_200_OK)
    

class AcceptFriendRequestView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request, pk):
        try:
            sender = User.objects.get(id=pk)
            if sender in request.user.friends.all():
                return Response (
                    {"detail": "User is already your friend"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            request.user.friends.add(sender)
            sender.friends.add(request.user)
            return Response(
                {"detail": "Friend request accepted successfully"},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while accepting the friend request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RemoveFriendView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def delete(self, request, pk):
        try:
            friend = User.objects.get(id=pk)
            if friend not in request.user.friends.all():
                return Response(
                    {"detail": "User is not your friend"}, status=status.HTTP_400_BAD_REQUEST
                )

            request.user.friends.remove(friend)
            friend.friends.remove(request.user)
            return Response(
                {"detail": "Friend removed successfully"}, status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while removing the friend"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RecieveHttpNotification(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            data = request.data
            player_1 = User.objects.get(id=data["player1_id"])
            player_2 = User.objects.get(id=data["player2_id"])

            data["type"] = "tournament_game_invitation"
            data["player1_id"] = ShortUserSerializer(player_1).data
            data["player2_id"] = ShortUserSerializer(player_2).data

            p1_group_name = f"user_{player_1.id}"
            p2_group_name = f"user_{player_2.id}"

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                p1_group_name,
                {
                    "type": "send_notification",
                    "message": data,
                },
            )

            async_to_sync(channel_layer.group_send)(
                p2_group_name,
                {
                    "type": "send_notification",
                    "message": data,
                },
            )




            return Response(
                {"detail": "Notification recieved successfully"},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while recieving the notification"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )






























def intra_42_callback(request):
    code = request.GET.get('code')
    if code:
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.INTRA_UID,
            "client_secret": settings.INTRA_SECRET,
            "code": code,
            "redirect_uri": "http://127.0.0.1:8000/api/auth/callback/"
        }
        
        
        response = requests.post(token_url, data=data)
        token_data = response.json()
        access_token = token_data.get("access_token")
        logger.error(f"\n\n\nintra_42_callback code: {code}   | access_token: {access_token} | client_id: {settings.INTRA_UID} | client_secret: {settings.INTRA_SECRET}\n\n\n")
        if access_token:
            user_info_url = "https://api.intra.42.fr/v2/me"
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            user_info_response = requests.get(user_info_url, headers=headers)
            user_data = user_info_response.json()
            email = user_data.get("email")
            username = user_data.get("login")
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
            else:
                random_password = secrets.token_urlsafe(16)
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=random_password,
                )
                avatar = user_data["image"]["link"]
                if(avatar):
                    response = requests.get(avatar, stream=True)
                    if (response.status_code == 200):
                        filename = f"user_{user.id}.jpg"
                        file_path = f"/assets/images/avatars/{filename}"
                        with open (f"{settings.BASE_DIR}{file_path}", "wb") as image_file:
                            for chunk in response.iter_content(2048):
                                image_file.write(chunk)
                        user.avatar = file_path
                user.save()
            refresh = RefreshToken.for_user(user)
            jwt_access_token = str(refresh.access_token)
            jwt_refresh_token = str(refresh)

            request.COOKIES['access_token'] = jwt_access_token
            init_user_stats(request, user.id)

            redirect_url = 'https://127.0.0.1/home/'
            response = HttpResponseRedirect(redirect_url)
            response.set_cookie("access_token", jwt_access_token, samesite="Lax", secure=True)
            response.set_cookie("refresh_token", jwt_refresh_token, samesite="Lax", secure=True)
            response.delete_cookie('csrftoken')
            response.delete_cookie('sessionid')
            return response
        
    redirect_url = 'https://127.0.0.1/login/'
    response = HttpResponseRedirect(redirect_url)
    return response

@login_required
def get_user_data(request):
    google_user = request.user.social_auth.get(provider='google-oauth2')
    profile_data = google_user.extra_data
    userModel = User.objects.get(email=request.user.email)
    image_file= profile_data.get("picture")
    if(image_file and userModel.avatar == "/assets/images/avatars/default.jpg"):
        response = requests.get(image_file, stream=True)
        if (response.status_code == 200):
            filename = f"user_{userModel.id}.jpg"
            file_path = f"./assets/images/avatars/{filename}"
            with open (file_path, "wb") as image_file:
                for chunk in response.iter_content(2048):
                    image_file.write(chunk)
            userModel.avatar = file_path[1:]
    userModel.username = profile_data.get("name")
    userModel.save()
    refresh = RefreshToken.for_user(userModel)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    redirect_url = 'https://127.0.0.1/home/'
    response = HttpResponseRedirect(redirect_url)
    request.COOKIES['access_token'] = access_token
    init_user_stats(request, request.user.id)
    response.delete_cookie('csrftoken')
    response.delete_cookie('sessionid')
    set_refresh_and_access_token(response, (access_token, refresh_token))
    
    return response
   

def encode_data(data):
    secret_key = settings.SECRET_KEY
    secret_key_bytes = secret_key.encode('utf-8')
    data_bytes = data.encode('utf-8')
    hmac_obj = hmac.new(secret_key_bytes, data_bytes, hashlib.sha256)
    hmac_digest = hmac_obj.digest()
    base64_encoded = base64.b64encode(hmac_digest)
    base64_message = base64_encoded.decode('utf-8')
    return base64_message

class Account(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = SerializerSignup(data = request.data)
        if serializer.is_valid():
            instance = serializer.save()
            access_token = str(RefreshToken.for_user(instance).access_token)
            request.COOKIES['access_token'] = access_token
            init_user_stats(request, serializer.data['id'])
            return Response(serializer.data, status=201)
        first_error = list(serializer.errors.items())[0]
        return Response({"error" : str(first_error[1][0])}, status=400)
        
        
    def get(self, request):
        token = request.GET.get('token')
        email = request.GET.get('email')
        if (email and token and token == encode_data(email)):
            return Response("success", status=200)
        else:
            return Response({"error": "copy the link from the email exact"}, status=400)
        
   
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            username = request.data.get('username')
            try:
                user = User.objects.get(username = username)
            except:
                return Response({"error":"User not found"}, status=404)
            if not user.two_factor_auth:
                utils.set_refresh_and_access_token(response)
            response.data["user_is_auth"] = user.two_factor_auth
            return response
        except Exception as e:
            print(f"Error occurred: {e}")
            return Response({"error": str(e)},status=status.HTTP_401_UNAUTHORIZED)

class SendEmailView(APIView):
    permission_classes = [AllowAny]
        
        
    def post(self, request):
        type = request.data.get("type")
        email = request.data.get("email")
        encode_email = urllib.parse.quote(encode_data(email))
        if type == "forgot":
            subject = "Password Reset"
            message = "Password Reset"
            content_html = f'''
                <div class="content">
                    <img class="manette" src="https://raw.githubusercontent.com/abouabra/ft_transcendence/refs/heads/master/frontend/assets/images/user_management/gamepad_17507234.png">
                    <span>Password Reset</span>
                    <img class="manette" src="https://raw.githubusercontent.com/abouabra/ft_transcendence/refs/heads/master/frontend/assets/images/user_management/gamepad_17507234.png">
                    <p>
                    Seems like you forgot your password for Fesablanca. if this is true, click below to reset your password.
                    </p>
                    <a href="https://127.0.0.1/forgot_password/?email={email}&token={encode_email}" class="button">Reset My Password</a>
                    <div class="footer">
                    <p>
                        If you did not forgot your password you can safely ignore this email.
                    </p>
                    <p>&copy; 2024 Fesablanca. All rights reserved.</p>
                    </div>
                </div>
            '''
        elif type == "signup":
            subject = "Verification email"
            message = "Verification email"
            content_html = f'''
            <div class="content">
                    <img class="manette" src="https://raw.githubusercontent.com/abouabra/ft_transcendence/refs/heads/master/frontend/assets/images/user_management/gamepad_17507234.png" >
                    <span>Hello !</span>
                    <img class="manette" src="https://raw.githubusercontent.com/abouabra/ft_transcendence/refs/heads/master/frontend/assets/images/user_management/gamepad_17507234.png" >
                    
                    <p>
                    Thank you for registering with Fesablanca.<br><br>To complete your registration, please verify your email by clicking the button below:
                    </p>
                    <a href="https://127.0.0.1/signup/?email={email}&token={encode_email}" class="button">Verify email address</a>
                    <p>
                    If the button doesn't work, you can also copy and paste the following link into your browser:
                    </p>
                    <p><a href="#" class="link">https://127.0.0.1/signup/?email={email}&token={encode_email}</a></p>
                    <div class="footer">
                    <p>
                        If you did not sign up for a Fesablanca account, please ignore this email.
                    </p>
                    <p>&copy; 2024 Fesablanca. All rights reserved.</p>
                    </div>
                </div>
            '''
        html_message = f'''
        <html>
            <head>
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

                body {{
                    margin: 0;
                    padding: 0;

                }}
                .background {{
                    padding: 20px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center!important;
                    align-items: center!important;
                    background-image: url("https://raw.githubusercontent.com/abouabra/ft_transcendence/refs/heads/user_management/frontend/assets/images/Background.jpg");
                }}
                .content {{
                    font-size:1rem;
                    font-family: "popins", sans-serif;
                    text-align: center;
                    color: #e6e7e7!important;
                    backdrop-filter: blur(20px);
                    background-color: rgba(39, 41, 46, 0.2);
                    border: 1px solid rgba(230, 231, 231, 0.4);
                    padding: 20px;
                    border-radius: 8px;
                    margin: auto;
                }}
                .manette{{
                    width: 3rem;
                    height: auto;
                }}
                span{{
                    font-size: 2rem;
                    color: #e6e7e7!important;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    
                }}
                .button{{
                    color: #17181b!important;
                    background-color: #d64b3a!important;
                    border: 0px;
                    padding: 0.7rem 1.2rem 0.7rem 1.2rem;
                    border-radius: 10px;
                    text-decoration: none!important;
                }}
                .button:hover{{
                    opacity: 0.8;
                    cursor: pointer;
                }}
                .link{{
                    color: #d64b3a!important;
                }}
                .link:hover{{
                    opacity: 0.8;
                }}
                p{{
                    line-height: 1.4rem;
                }}
                </style>
            </head>
            <body>
                <div class="background">
                {content_html}
                </div>
            </body>
        </html>
'''
        send_mail(
            subject,
            message,
            None,
            [email],
            fail_silently=False,
            html_message=html_message,
        )
        return Response("success", status=200)

class VerificationEmail(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = {'email': request.data.get('email')}
        typee = request.data.get('type')
        serializer = ValidEmail(data=email)
        if serializer.is_valid():
            if typee == "signup" and User.objects.filter(email=email['email']).exists():
                return Response({"error": "Email already exists."}, status=400)
            elif typee == "forgot" and not User.objects.filter(email=email['email']).exists():
                return Response({"error": "Email doesn't exists."}, status=400)
            return Response({"message": "Email is valid and can be used."}, status=200)
        else:
            return Response({"error": "Enter a valid email address."}, status=400)


class Forgot_password(APIView):
    permission_classes = [AllowAny,]
    
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.get(email=email)
        password = request.data.get('password')
        password_confirm = request.data.get('password_confirm')

        if password != password_confirm:
            return Response({"error": "Passwords do not match."}, status=400)

        user.set_password(password)
        user.save()

        return Response("success", status=200)


class SetupTwoFactorAuthView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request):
        username = request.user.username
        userobj = User.objects.get(username = username)
        
        if(not userobj.two_factor_auth):
            secret = pyotp.random_base32()
            userobj.otp_secret = secret
            # userobj.two_factor_auth=True
            userobj.save()
            uri = f"otpauth://totp/MyApp:{userobj.email}?secret={userobj.otp_secret}&issuer=MyApp"
            create_qr_code(userobj.avatar, uri, "qrcode.png")
            return Response({"user_is_auth": True}, status=200)
        else:
            userobj.two_factor_auth=False
            userobj.save()
            return Response({"user_is_auth": userobj.two_factor_auth}, status=200)


class VerifyTwoFactorAuthView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        username=request.data.get('username')
        from_login = request.data.get("from_login")
        otp = request.data.get("otp")
        if not otp:
            return Response({"error": "OTP is required."}, status=400)

        try:
            user = User.objects.get(username = username)
        except user.DoesNotExist:
            return Response({"error": "User profile not found."}, status=404)

        totp = pyotp.TOTP(user.otp_secret)
        if totp.verify(otp):
            user.two_factor_auth = True
            if from_login:
                response = super().post(request, *args, **kwargs)
                utils.set_refresh_and_access_token(response)
                return response
            else:
                user.save()
                return Response({"success": "code correct."}, status=200)
                
        else:
            return Response({"error": "code incorrect."}, status=400)



# class TwoFactorAuth(TokenObtainPairView, generics.GenericAPIView):
#     permission_classes = (permissions.AllowAny,)

#     def put(self, request):
#         if not request.user.is_authenticated:
#             return Response({"error": "Authentication required."}, status=401)
#         username = request.user.username
#         userobj = User.objects.get(username = username)
#         if(not userobj.two_factor_auth):
#             secret = pyotp.random_base32()
#             userobj.otp_secret = secret
#             userobj.two_factor_auth=True
#             userobj.save()
#             uri = f"otpauth://totp/MyApp:{userobj.email}?secret={userobj.otp_secret}&issuer=MyApp"
#             create_qr_code(userobj.avatar, uri, "qrcode.png")
#             return Response({"user_is_auth": userobj.two_factor_auth}, status=200)
#         else:
#             userobj.two_factor_auth=False
#             userobj.save()
#             return Response({"user_is_auth": userobj.two_factor_auth}, status=200)


#     def post(self, request, *args, **kwargs):
#         print(request.data)
#         username=request.data.get('username')
#         user = User.objects.get(username = username)
#         otp = request.data.get('otp')
#         print(otp)
#         totp = pyotp.TOTP(user.otp_secret)
#         if totp.verify(otp):
#             user.two_factor_auth = True
#             print("success")  
#             response = super().post(request, *args, **kwargs)
#             utils.set_refresh_and_access_token(response)
#             return response
#         else:
#             print("faild")
#             return Response({"error": "code incorrect."}, status=400)
        
from datetime import datetime
import os

class user_info(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        
        infos = {
            "username" : request.user.username,
            "email" : request.user.email,
            "two_f_a" : request.user.two_factor_auth,
            "profile_banner" : request.user.profile_banner,   
            "pdp" : request.user.avatar,
        }

        return Response(infos ,status=200)
    
    def post(self, request):
        change = False
        user = User.objects.get(id = request.user.id)
        username = request.data.get("username")
        password = request.data.get("password")
        password_confirmation = request.data.get("password_confirmation")
        bannerInput = request.data.get("bannerImage")
        avatarInput = request.data.get("avatarImage")
        
        if (not password and password_confirmation) or (password and not password_confirmation):
            return Response({"error":"Fill password and password confirmation"}, status = 400)
        elif password and password_confirmation :
            if password != password_confirmation:
                return Response({"error":"Passwords do not match"}, status = 400)
            elif len(password) < 8:
                return Response({"error":"Use at least 8 characters"}, status = 400)
            else:
                change = True
                user.set_password(password)
        if username and user.username != username :
            print(username, user.username)
            if User.objects.filter(username = username).exists():
                return Response({"error":"Username already existe"}, status = 400)
            else:
                change = True
                user.username = username
        if bannerInput:
            try:
                split_base_64 = bannerInput.split(';base64,')
                image_data = base64.b64decode(split_base_64[1])
                filename_0 = f"{datetime.now()}user_banner{request.user.id}.jpg"
                filename = utils.replace_spaces_with_underscores(filename_0)
                file_path = f"./assets/images/banners/{filename}"
                if(os.path.exists(f".{user.profile_banner}")):
                    os.remove(f".{user.profile_banner}")  
                with open (file_path, "wb") as f:
                    f.write(image_data)
                user.profile_banner = file_path[1:]
                change = True
            except(IndexError, base64.binascii.Error) as e:
                return Response({"error": "Invalid banner image format"}, status=400)
                
        if avatarInput:
            try:
                split_base_64 = avatarInput.split(';base64,')
                image_data = base64.b64decode(split_base_64[1])
                filename_0 = f"{datetime.now()}user_{request.user.id}.jpg"
                filename = utils.replace_spaces_with_underscores(filename_0)
                file_path = f"./assets/images/avatars/{filename}"
                if(os.path.exists(f".{user.avatar}")):
                    os.remove(f".{user.avatar}")    
                with open (file_path, "wb") as f:
                    f.write(image_data)
                print(file_path)
                print(file_path[1:])
                user.avatar = file_path[1:]
                change = True
            except(IndexError, base64.binascii.Error) as e:
                return Response({"error": "Invalid avatar image format"}, status=400)
        if change == True :
            user.save()
            return Response({"success":"succefully changed", "avatar":user.avatar} ,status=200)
        return Response({"nothing":"nothing change"} ,status=200)
        
        
        

class ProfileView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShortUserSerializer

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            if user.status == "deleted":
                return Response(
                    {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
            response_data = {}
            response_data["user"] = ShortUserSerializer(user).data
            response_data["user"]["is_friend"] = user in request.user.friends.all()
            response_data["user"]["is_blocked"] = user in request.user.blocked.all()
            response_data["user"]["profile_banner"] = user.profile_banner
            stats = getProfileStats(request, user.id)

            user_ids = set()
            for game_name in ["pong", "space_invaders", "road_fighter"]:
                for game in stats[game_name]["recent_games"]:
                    user_ids.add(game["player1"])
                    user_ids.add(game["player2"])

            users = User.objects.filter(id__in=user_ids)
            users_dict = {user.id: ProfileUserSerializer(user).data for user in users}

            for game_name in ["pong", "space_invaders", "road_fighter"]:
                for game in stats[game_name]["recent_games"]:
                    game["player1"] = users_dict[game["player1"]]
                    game["player2"] = users_dict[game["player2"]]
          
            response_data.update(stats)
            return Response(response_data, status=status.HTTP_200_OK)
        
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

class SetUserPlayingGameView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        game_name = request.data.get("game_name")
        user_id = request.data.get("user_id")
        
        if not user_id:
            return Response({"error": "User ID is required"}, status=400)

        if game_name not in ["pong", "space_invaders", "road_fighter", None]:
            return Response(
                {"error": "Invalid game name"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            print(f"\n\n\n\nuser_id: {user_id} game_name: {game_name}\n\n\n\n")
            user = User.objects.get(id=user_id)
            user.is_playing = game_name
            user.save()
            return Response({"detail": "User playing status updated successfully"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"==============\n\n {str(e)} \n\n==============")
            return Response(
                {"detail": "Error encountered while updating the user playing status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
class UnblockAndBlock(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        is_blocked = request.data.get("isBlocked")
        print("\n\n",is_blocked, "\n\n")
        friend_id = request.data.get("id")
        friend = User.objects.get(id=friend_id)
        if(is_blocked):
            print(request.user.blocked.all())
            if friend not in request.user.blocked.all():
                return Response(
                    {"error": "User is not blocked"}, status=status.HTTP_400_BAD_REQUEST
                )
            request.user.blocked.remove(friend)
            friend.blocked.remove(request.user)
        elif(not is_blocked):
            if friend in request.user.blocked.all():
                return Response(
                    {"error": "User is already blocked"}, status=status.HTTP_400_BAD_REQUEST
                )
            request.user.blocked.add(friend)
            friend.blocked.add(request.user)
            print(request.user.blocked.all())
        return Response({"detail": "change"}, status=status.HTTP_200_OK)
        

class send_report(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        email = settings.EMAIL_HOST_USER
        subject = request.data.get("subject")
        description = request.data.get("description")
        id = request.data.get("id")
        user_reported = User.objects.get(id = id)
        message = "**"+request.user.username+"**"+" report "+"**"+user_reported.username+"**"+"\n"+ description
        send_mail(
            subject,
            message,
            None,
            [email],
            fail_silently=False,
            # html_message=html_message,
        )
        return Response({"success": "report sent"}, status=status.HTTP_200_OK)
        