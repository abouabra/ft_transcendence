from rest_framework.response import Response
from rest_framework import status


def check_if_logged_in(func):
    def wrapper(*args, **kwargs):
        request = args[1]
        if request.user.is_authenticated:
            return Response(
                {"detail": "You are already logged in"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return func(*args, **kwargs)

    return wrapper