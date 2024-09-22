from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone
from rest_framework.pagination import PageNumberPagination
from .serializers import ServerSerializer, MessageSerializer
from .models import Server, Message
import logging
from .utils import getUserData

logger = logging.getLogger(__name__)


class JoinedServersView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer

    def get(self, request):
        all_servers = Server.objects.filter(members__contains=[request.user.id])
        servers_data = self.serializer_class(all_servers, many=True).data
        
        return Response(servers_data, status=status.HTTP_200_OK)

class ChatBarDataViews(generics.GenericAPIView):
    serializer_class = ServerSerializer

    def post(self, request):
        serializer = ServerSerializer(data=request.data)

        if serializer.is_valid():
            return Response({
                "detail": "Server Created Successfully"
            }, status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)