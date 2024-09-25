from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timezone
from rest_framework.pagination import PageNumberPagination
from .serializers import ServerSerializer, MessageSerializer
from .models import Server, Message
import logging
from .utils import getUserData
import base64

logger = logging.getLogger(__name__)


class JoinedServersView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer

    def get(self, request):
        all_servers = Server.objects.filter(members__contains=[request.user.id])
        servers_data = self.serializer_class(all_servers, many=True).data
        
        return Response(servers_data, status=status.HTTP_200_OK)
import os
import io
from django.conf import settings

class CreateServerView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    def post(self, request):
        serializer = ServerSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.data
            header, image = request.data['img'].split(',')
            extention = header.split(';')[0].split('/')[1]

            image = base64.b64decode(image)
            avatar_name = f"{data['name']}.{extention}"
            path_in_disk = os.path.join(settings.BASE_DIR, "assets/images/server_avatars/", avatar_name)
            
            path_in_db = f"/assets/images/server_avatars/{avatar_name}"

            obg = Server.objects.create(
                name=data["name"],
                avatar=path_in_db,
                visibility=data['visibility'],
                password=data['password'],
            )
            obg.add_member(request.data['id'])
            obg.save()
            with open(path_in_disk,'wb') as file:
                file.write(image)

            return Response({
                    "detail": "Server Created Successfully"
                }, status.HTTP_201_CREATED)
        return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetServerDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    def get(self, request):
        # containe id

	    # {type: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },
	    # {type: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },
	    # {type: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },

        # protected needs extra data
        # all_server_objects = Server.objects.filter()
        # for server_obj in all_server_objects:
        #     server_obj 
        #     user_data = getUserdata(request, 2)
        #     server_obj["username"] = user_data.username
        servers = Server.objects.filter(members__contains=[request.user.id])
        for server in servers:
            pass            


        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data, status.HTTP_201_CREATED)
        # return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)