from django.http import JsonResponse
from rest_framework.response import Response
from django.utils.deprecation import MiddlewareMixin
import jwt


class JsonResponseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if (
            response.status_code >= 400
            and not isinstance(response, JsonResponse)
            and not isinstance(response, Response)
        ):
            return JsonResponse(
                {
                    "details": response.reason_phrase,
                },
                status=response.status_code,
            )
        return response


class JWTAuthCookieMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        if access_token:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"

        if refresh_token:
            request.META["HTTP_X_REFRESH_TOKEN"] = refresh_token
