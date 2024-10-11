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

import os
import io
from django.conf import settings


logger = logging.getLogger(__name__)

class JoinedServersView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer

    def get(self, request):
        all_servers = Server.objects.filter(members__contains=[request.user.id], visibility__in=['public', 'private'])
        servers_data = self.serializer_class(all_servers, many=True).data
        
        return Response(servers_data, status=status.HTTP_200_OK)

class CreateServerView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        serializer = ServerSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.data
            path_in_db = "/assets/images/server_avatars/default.jpg"
            if request.data['img']:
                header, image = request.data['img'].split(',')
                extention = header.split(';')[0].split('/')[1]
                image = base64.b64decode(image)
                avatar_name = f"{data['name']}.{extention}"
                path_in_disk = os.path.join(settings.BASE_DIR, "assets/images/server_avatars/", avatar_name)
            
                path_in_db = f"/assets/images/server_avatars/{avatar_name}"
                with open(path_in_disk,'wb') as file:
                    file.write(image)

            obg = Server.objects.create(
                name=data["name"],
                avatar=path_in_db,
                visibility=data['visibility'],
                password=data['password'],
            )
            obg.add_member(request.data['id'])
            obg.save()
            return Response({
                    "success": "Server Created Successfully"
                }, status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetServerListView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        final_data = []
        server = Server.objects.filter(visibility__in=["public", "private"])
        servers = ServerSerializer(server,many=True)
        for item in servers.data:
            member = item['members']
            visibility = item['visibility']
            server_name = item['name']
            avatar = item['avatar']
            final_data.append({
                "server_name":server_name,
                "visibility":visibility,
                "avatar":avatar,
                "member":member
            })
        return Response(final_data, status.HTTP_201_CREATED)
    
    

class GetServerDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    def get(self, request):
        # containe id

	    # {visibility: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },
	    # {visibility: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },
	    # {visibility: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },

        # protected needs extra data
        # all_server_objects = Server.objects.filter()
        # for server_obj in all_server_objects:
        #     server_obj 
        #     user_data = getUserdata(request, 2)
        #     server_obj["username"] = user_data.username
        final_data = []
        servers = Server.objects.filter(members__contains=[request.user.id])
        serializer = ServerSerializer(servers, many=True)

        array = serializer.data
        if (request.query_params and request.query_params['server']):
            array = [ item for item in serializer.data if item['name'] == request.query_params["server"]]

        for server in array:
            member = server['members']
            member.remove(request.user.id)
            visibility = server['visibility']
            server_name = server['name']
            user_id = request.user.id
            username = 0
            avatar = 0
            online = 'offline'
            latest_message = 0
            latest_timestamp = 0
            if (server['visibility'] == 'protected'):
                userdata =  getUserData(request,member[0])
                avatar = userdata['avatar']
                user_id = userdata['id']
                username = userdata['username']
                online = userdata['status']
                try:
                    message = Server.objects.get(pk=user_id).server_message.all()
                    if (len(message) > 0):
                        message = message[len(message)-1]
                        latest_message = message.content
                        latest_timestamp = message.timestamp.strftime("%H:%M%p")
                except Server.DoesNotExist:
                    print('emptyyyyyyyyyyyy')
            else:
                avatar = server['avatar']
                username = server_name
                try:
                    message = Server.objects.get(pk=user_id).server_message.all()
                    if (len(message) > 0):
                        latest_message= message[len(message)-1].content
                        latest_timestamp = message[len(message)-1].timestamp.strftime("%H:%M%p")
                except Server.DoesNotExist:
                    print('emptyyyyyyyyyyyy')

                else:
                    latest_message = ''
                    latest_timestamp = ''


            data = {
                'visibility':visibility,
                'server_name':server_name,
                'user_id':user_id,
                'name':username,
                'status':online,
                'member':member,
                'avatar':avatar,
                'latest_message':latest_message,
                'latest_timestamp':latest_timestamp
            }
            final_data.append(data)
        return Response(final_data, status.HTTP_201_CREATED)
    


class GetMessageDataView(generics.GenericAPIView):

    def get(self, request):
        data = []
        if (request.query_params and request.query_params['chat']):
            try:
                serverrs = Server.objects.get(name=request.query_params['chat'])
                server_name = serverrs.name
                avatar = serverrs.avatar
                messages = serverrs.server_message.all()
                id = -1
                if serverrs.visibility == 'protected':
                    id1,id2 = serverrs.name.split('_')
                    id = id2
                    if (id1 != request.user.id):
                        id = id1
                for message in messages:
                    userdata =  getUserData(request,message.sender_id)
                    if (id == message.sender_id):
                        avatar = userdata.avatar
                    body = {
                        'content':message.content,
                        'timestamp':message.timestamp.strftime("%H:%M%p"),
                        'avatar':userdata['avatar'],
                        'username':userdata['username'],
                        'visibility':message.server.visibility
                    }
                    data.append(body)
            except Server.DoesNotExist:
                return Response({'error':'invalide queryparam'}, status=status.HTTP_400_BAD_REQUEST)
            
            body = {
                'server_name':server_name,
                'avatar':avatar
            }
            return Response(data, status.HTTP_200_OK)
        return Response({'error':'invalide queryparam'}, status=status.HTTP_400_BAD_REQUEST)
