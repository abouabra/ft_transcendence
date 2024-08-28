from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status


class IsAuthenticatedView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        return Response({"detail": "You are authenticated"}, status=status.HTTP_200_OK)
