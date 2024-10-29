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
    def post(self, request):
        serializer = ServerSerializer(data=request.data)

class CreateServerView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        request.data['password'] = make_password(request.data['password'])
        serializer = ServerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            print(data)
            if request.data['img']:
                image = request.data['img'].split(',')[1]
                image = base64.b64decode(image)
                path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
                with open(path_in_disk,'wb') as file:
                    file.write(image)
            create_qr_code(data['avatar'], f"http://127.0.0.1:3000/chat/join_server/{data['name']}/",data['qr_code'].split('/')[-1])
            return Response({
                    "success": "Server Created Successfully"
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request):
        print(request.data)
        if (request.data['password']):
            request.data['password'] = make_password(request.data['password'])
        try:
            server = Server.objects.get(name=request.data['old_name'])
        except Server.DoesNotExist:
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)
        data = request.data
        if data['img']:
            image = data['img'].split(',')[1]
            image = base64.b64decode(image)
            path_in_disk = f"{settings.BASE_DIR}{data['avatar']}"
            with open(path_in_disk,'wb') as file:
                file.write(image)
        create_qr_code(data['avatar'], f"http://127.0.0.1:3000/chat/join_server/{data['name']}/",data['qr_code'].split('/')[-1])
        server.name = data['name']
        server.visibility = data['visibility']
        server.avatar = data['avatar']
        server.qr_code = data['qr_code']
        if server.password:
            server.password = make_password(data['password'])
        server.save()
        return Response({
                "success": "Server Created Successfully"
            }, status=status.HTTP_201_CREATED)
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
                    "members":len(server.members)
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
                print("wring password")
                return Response({"error":"Wrong password"}, status.HTTP_400_BAD_REQUEST)
            else:
                server.add_member(request.user.id)
            return Response({"success":"user joined the server", "server_name":server.name}, status.HTTP_200_OK)
        except Server.DoesNotExist:
            print("not found")
            return Response({"error":"server not found"}, status.HTTP_404_NOT_FOUND)


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
                'status':online,
                'member':member,
                'staffs':server['staffs'],
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
                id = -1
                if serverrs.visibility == 'protected':
                    id1,id2 = serverrs.name.split('_')
                    id = id2
                    if (id1 != request.user.id):
                        id = id1
                member_user = serverrs.members
                alluserdata = {}
                for member_id in member_user:
                    alluserdata[member_id] = getUserData(request,member_id)
                for message in messages:
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


class ServerInfo(generics.GenericAPIView):
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
                return Response({"success":"user left the server"}, status.HTTP_200_OK)
            except Server.DoesNotExist:
                return Response({'error':'invalide query param'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({}, status.HTTP_200_OK)