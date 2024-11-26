from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from datetime import datetime, timezone
from rest_framework.pagination import PageNumberPagination
from .serializers import ServerSerializer, MessageSerializer
from .models import Server, Message
import logging
from .utils import getUserData
import base64
from .request_api import create_qr_code
import os
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
        request.data['password'] = make_password(request.data['password'])
        serializer = ServerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            logger.error(data)
            if request.data['img']:
                image = request.data['img'].split(',')[1]
                image = base64.b64decode(image)
                path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
                with open(path_in_disk,'wb') as file:
                    file.write(image)
            create_qr_code(data['avatar'], f"https://127.0.0.1/chat/join_server/{data['name']}/",data['qr_code'].split('/')[-1])
            return Response({
                    "success": "Server Created Successfully"
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors["non_field_errors"], status=status.HTTP_400_BAD_REQUEST)
    def put(self, request):

        try:
            channel_layer = get_channel_layer()
            server = Server.objects.get(name=request.data['old_name'])
        except Server.DoesNotExist:
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
        if (request.user.id not in server.staffs):
            return Response({"error":"you are not staff of this server"}, status.HTTP_400_BAD_REQUEST)
        data = request.data

        if data['img']:
            image = data['img'].split(',')[1]
            image = base64.b64decode(image)
            path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
            with open(path_in_disk,'wb') as file:
                file.write(image)
        create_qr_code(data['avatar'], f"https://127.0.0.1/chat/join_server/{data['name']}/",data['qr_code'].split('/')[-1])
        server.name = data['name']
        server.visibility = data['visibility']
        server.avatar = data['avatar']
        server.qr_code = data['qr_code']
        server.password = make_password(data['password'])
        server.save()

        async_to_sync(channel_layer.group_send)(
            f"chat_{data['old_name']}_edit",
            {
                "type" : "edits_message",
                "message":  data['name'],
                "new_server_name": data['name'],
                "current": data['old_name']
            }
        )
        return Response({
                "success": "Server edited Successfully"
            }, status=200)

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
    

class GetServerjoinedDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        if (request.query_params.get('server_name') is None):
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
        server_name = request.query_params.get('server_name')
        try:
            server = Server.objects.get(name=server_name)

            if server:
                data = {
                    "server_name":server_name,
                    "visibility":server.visibility,
                    "avatar":server.avatar,
                    "members":len(server.members),
                    "staffs":server.staffs
                }
            return Response(data, status.HTTP_200_OK)
        except Server.DoesNotExist:
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
    def post(self, request):
        try:
            server = Server.objects.get(name=request.data['server_name'])
            if request.user.id in server.members:
                return Response({"error":"user already joined the server"}, status.HTTP_400_BAD_REQUEST)
            if server.visibility == "private":
                if request.data['password']:
                    if server.check_passwd(request.data['password']):
                        server.add_member(request.user.id)
                        return Response({"success":"user joined the server", "server_name":server.name}, status.HTTP_200_OK)
                return Response({"error":"Wrong password"}, status.HTTP_400_BAD_REQUEST)
            else:
                server.add_member(request.user.id)
            return Response({"success":"user joined the server", "server_name":server.name}, status.HTTP_200_OK)
        except Server.DoesNotExist:
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
class GetServerchatDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, type):
        final_data = []
        if (type == "Direct"):
            servers = Server.objects.filter(members__contains=[request.user.id]).filter(visibility="protected")
        else:
            servers = Server.objects.filter(members__contains=[request.user.id]).exclude(visibility="protected")
        if (not servers):
            return Response({}, status=200)
        servers_data = ServerSerializer(servers, many=True).data
        for index, server in enumerate(servers_data):
            visibility = server['visibility']
            member = server['members']
            if (request.user.id in member):
                member.remove(request.user.id)
            server_name = server['name']
            user_id = request.user.id
            online = 'offline'
            latest_message = ''
            avatar = server['avatar']
            username = server_name
            try:
                latest_msg_obj = Message.objects.filter(server=servers[index]).exclude(blocked__contains=[request.user.id]).order_by("timestamp")
                if(latest_msg_obj.count() > 0): 
                    latest_msg_obj = latest_msg_obj.last()
                    latest_message_data = MessageSerializer(latest_msg_obj).data
                    latest_message = latest_message_data["content"]
                    latest_timestamp = latest_message_data["timestamp"]
                else:
                    raise Message.DoesNotExist

            except (Message.DoesNotExist):
                    latest_message = ''
                    latest_timestamp = ''

            if (visibility == 'protected'):
                userdata =  getUserData(request,member[0])
                avatar = userdata['avatar']
                user_id = userdata['id']
                username = userdata['username']
                online = userdata['status']


            data = {
                'visibility':visibility,
                'server_name':server_name,
                'user_id':user_id,
                'name':username,
                'username':username,
                'status':online,
                'member':member,
                'staffs':server['staffs'],
                'banned':server['banned'],
                'avatar':avatar,
                'latest_message':latest_message,
                'latest_timestamp':latest_timestamp,
                'qr_code':server['qr_code']
            }
            final_data.append(data)
        return Response(final_data, status.HTTP_200_OK)

class GetServerDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        final_data = []
        if (request.query_params and request.query_params['server']):
            servers = Server.objects.filter(name=request.query_params['server'])
            servers_data = ServerSerializer(servers, many=True).data
        else:
            servers = Server.objects.filter(members__contains=[request.user.id])
            serializer = ServerSerializer(servers, many=True)
            servers_data = serializer.data
        
        for index, server in enumerate(servers_data):
            member = server['members']
            if (request.user.id in member):
                member.remove(request.user.id)
            visibility = server['visibility']
            server_name = server['name']
            user_id = request.user.id
            online = 'offline'
            latest_message = ''
            avatar = server['avatar']
            username = server_name
            try:
                latest_msg_obj = Message.objects.filter(server=servers[index]).exclude(blocked__contains=[request.user.id]).order_by("timestamp")
                if(latest_msg_obj.count() > 0): 
                    latest_msg_obj = latest_msg_obj.last()
                    latest_message_data = MessageSerializer(latest_msg_obj).data
                    latest_message = latest_message_data["content"]
                    latest_timestamp = latest_message_data["timestamp"]
                else:
                    raise Message.DoesNotExist

            except (Message.DoesNotExist):
                    latest_message = ''
                    latest_timestamp = ''

            if (server['visibility'] == 'protected'):
                userdata =  getUserData(request,member[0])
                avatar = userdata['avatar']
                user_id = userdata['id']
                username = userdata['username']
                online = userdata['status']


            data = {
                'visibility':visibility,
                'server_name':server_name,
                'user_id':user_id,
                'name':username,
                'username':username,
                'status':online,
                'member':member,
                'staffs':server['staffs'],
                'banned':server['banned'],
                'avatar':avatar,
                'latest_message':latest_message,
                'latest_timestamp':latest_timestamp,
                'qr_code':server['qr_code']
            }
            final_data.append(data)
        return Response(final_data, status.HTTP_200_OK)


class GetMessageDataView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        data = []
        if (request.query_params and request.query_params['chat']):
            try:
                serverrs = Server.objects.get(name=request.query_params['chat'])
                messages = serverrs.server_message.exclude(blocked__contains=[request.user.id]).order_by('timestamp')

                member_user = serverrs.members
                alluserdata = {}
                for member_id in member_user:
                    alluserdata[member_id] = getUserData(request,member_id)
                for message in messages:
                    if (message.sender_id not in member_user):
                       member_user.append(message.sender_id)
                       alluserdata[message.sender_id] = getUserData(request,message.sender_id)
                    userdata = alluserdata[message.sender_id]
                    body = {
                        'content':message.content,
                        'timestamp':message.timestamp,
                        'avatar':userdata['avatar'],
                        'username':userdata['username'],
                        'visibility':message.server.visibility,
                        'message_id':message.pk,
                        'created_at':message.timestamp,
                        'user_id':message.sender_id,
                        'qr_code':serverrs.qr_code,
                        'staffs':serverrs.staffs,
                        'banned':serverrs.banned
                    }
                    data.append(body)
            except Server.DoesNotExist:
                return Response({'error':'invalide queryparam'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data, status.HTTP_200_OK)
        return Response({'error':'invalide queryparam'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if (request.query_params and request.query_params['chat']):
            data = {
                'message_id':request.query_params['chat'],
                'server_name':request.query_params['server'],
                'delete_type':request.query_params['type']
            }
        try:
            message_delete = Message.objects.get(pk=data['message_id'])
            server = Server.objects.get(name=data['server_name'])
            if (request.user.id in server.banned):
                return Response({'error':'You dont have permission'}, status=status.HTTP_403_FORBIDDEN)
            if data['delete_type'] == "for_everyone":
                message_delete.delete()

            elif len(message_delete.blocked) + 1 == len(server.members):
                message_delete.delete()

            else:
                message_delete.blocked.append(request.user.id)
                message_delete.save()
            return Response({"success:message deleted"}, status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response({'error':'No message was Found'}, status=status.HTTP_400_BAD_REQUEST)


class ServerInfoVisibility(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        if (request.query_params and request.query_params['server']):
            try:
                server = Server.objects.get(name=request.query_params['server'])
                if (request.user.id not in server.members):
                    return Response({'error':'not Chat found'}, status=status.HTTP_400_BAD_REQUEST)
                server = ServerSerializer(server).data
                return Response({"visibility":server['visibility']}, status.HTTP_200_OK)
            except Server.DoesNotExist:
                return Response({'error':'invalide query param'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status.HTTP_200_OK)

class LeaverServer(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def delete(self, request):
        if (request.query_params and request.query_params['server']):
            try:
                server = Server.objects.get(name=request.query_params['server'])
                if (request.user.id not in server.members):
                    return Response({'error':'not Chat found'}, status=status.HTTP_400_BAD_REQUEST)
                server.remove_member(request.user.id)
                if (len(server.members) == 0):
                    logger.error(f"full path = {settings.BASE_DIR}")
                    os.remove(f"{settings.BASE_DIR}{server.avatar}")
                    os.remove(f"{settings.BASE_DIR}{server.qr_code}")
                    server.delete()
                return Response({"success":"user left the server"}, status.HTTP_200_OK)
            except Server.DoesNotExist:
                return Response({'error':'invalide query param'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status.HTTP_200_OK)

class Serverusermanager(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request):

        try:
            server = Server.objects.get(name=request.data['server_name'])
            if (request.user.id not in server.staffs and request.user.id not in server.banned):
                return Response({'error':'You dont have permission'}, status=status.HTTP_403_FORBIDDEN)
            if (request.user.id in server.banned):
                return Response({'error':'You are banned from this server'}, status=status.HTTP_403_FORBIDDEN)
            if request.data['action'] == "ban":
                server.banned.append(request.data['user_id'])
            elif request.data['action'] == "unban" and request.data['user_id'] in server.banned:
                server.banned.remove(request.data['user_id'])
            elif request.data['action'] == "add_staff":
                server.staffs.append(request.data['user_id'])
            elif request.data['action'] == "remove_staff" and request.data['user_id'] in server.staffs:
                server.staffs.remove(request.data['user_id'])
            server.save()
        except Server.DoesNotExist:
            return Response({'error':'server not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success":"user banned"}, status.HTTP_200_OK)

class BlockUserView(generics.GenericAPIView):
    
    def post(self, request):
        server_name = request.data['server_name']
        user_toblock = request.data['user_id']
        try:
            server = Server.objects.get(name=server_name)
            if (server.visibility != 'protected'):
                return Response({'error':'server not protected'}, status=status.HTTP_403_FORBIDDEN)
            if (request.data['action'] == 'Block'):
                server.banned.append(user_toblock)
            elif (request.data['action'] == 'Unblock'):
                server.banned.remove(user_toblock)
            server.save()
        except Server.DoesNotExist:
            return Response({'error':'chat not found'}, status=status.HTTP_400_BAD_REQUEST)
class CreateRoomView(generics.GenericAPIView):

    def get(self, request, id):
        try:
            if (id == request.user.id):
                return Response({"error":"Won't create room for the same user"}, status=400)
            name = f"{id}_{request.user.id}"
            if (id > request.user.id):
                name = f"{request.user.id}_{id}"
            chat = Server.objects.get(name=name)
            return Response({"success":"already exists"}, status=200)
        except Server.DoesNotExist:
            Server.objects.create(name=name,visibility="protected", members=[id,request.user.id])
            return Response({"success":"room created"}, status=201)