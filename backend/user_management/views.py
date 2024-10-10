from .models import User
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from datetime import timedelta
from rest_framework.response import Response
from email.mime.text import MIMEText
from rest_framework import status
from .serializers import SerializerSignup, ValidEmail
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
import base64, hmac, hashlib, urllib.parse

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
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
        
    def get(self, request):
        token = request.GET.get('token')
        email = request.GET.get('email')
        if (token == encode_data(email)):
            return Response("success", status=200)
        else:
            return Response("invalid mail", status=400)
            

class Home(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print(response)
        access_token_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        refresh_token = response.data.pop("refresh", None)
        access_token = response.data.pop("access", None)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="None",
            max_age=int(refresh_token_lifetime.total_seconds())
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="None",
            max_age=int(access_token_lifetime.total_seconds())
        )

        return response

class SendEmailView(APIView):
    permission_classes = [AllowAny]
        
        
    def post(self, request):
        type = request.data.get("type")
        print(type)
        email = request.data.get("email")
        encode_email = urllib.parse.quote(encode_data(email))
        if type == "forgot":
            subject = "Password Reset"
            message = "Password Reset"
            content_html = f'''
                <div class="content">
                    <img class="manette" src="https://cdn.discordapp.com/attachments/1075013928440049735/1290237510626185229/gamepad_17507234.png?ex=66fbbad1&is=66fa6951&hm=bc921d591cb71e881038e8f6d5a88c8baaf8c8ceabfacee085a4795ae4f353e4&" >
                    <span>Password Reset</span>
                    <img class="manette" src="https://cdn.discordapp.com/attachments/1075013928440049735/1290237510626185229/gamepad_17507234.png?ex=66fbbad1&is=66fa6951&hm=bc921d591cb71e881038e8f6d5a88c8baaf8c8ceabfacee085a4795ae4f353e4&" >
                    <p>
                    Seems like you forgot your password for Fesablanca. if this is true, click below to reset your password.
                    </p>
                    <a href="http://127.0.0.1:8000/signup/?email={email}&token={encode_email}" class="button">Reset My Password</a>
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
                    <img class="manette" src="https://cdn.discordapp.com/attachments/1075013928440049735/1290237510626185229/gamepad_17507234.png?ex=66fbbad1&is=66fa6951&hm=bc921d591cb71e881038e8f6d5a88c8baaf8c8ceabfacee085a4795ae4f353e4&" >
                    <span>Hello !</span>
                    <img class="manette" src="https://cdn.discordapp.com/attachments/1075013928440049735/1290237510626185229/gamepad_17507234.png?ex=66fbbad1&is=66fa6951&hm=bc921d591cb71e881038e8f6d5a88c8baaf8c8ceabfacee085a4795ae4f353e4&" >
                    
                    <p>
                    Thank you for registering with Fesablanca.<br><br>To complete your registration, please verify your email by clicking the button below:
                    </p>
                    <a href="http://127.0.0.1:8000/signup/?email={email}&token={encode_email}" class="button">Verify email address</a>
                    <p>
                    If the button doesn't work, you can also copy and paste the following link into your browser:
                    </p>
                    <p><a href="#" class="link">http://127.0.0.1:8000/signup/?email={email}&token={encode_email}</a></p>
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
                    background-image: url("https://cdn.discordapp.com/attachments/1110531293185331240/1289993814320087111/Background.jpg?ex=66fad7dc&is=66f9865c&hm=684aac560b3fe2bd0fe6fbd8c82d6f41eed1aa9c1c900e97956f98d675135f94&");
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
        email = {'email':request.data.get('email')}
        serializer = ValidEmail(data=email)
        if serializer.is_valid():
            return Response("",status=200)
        else:
            return Response(serializer.errors, status=400)