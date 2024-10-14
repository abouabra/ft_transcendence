from rest_framework import serializers
from .models import Server, Message
import base64

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"

class ServerSerializer(serializers.ModelSerializer):
    server_message = MessageSerializer
    class Meta:
        model = Server
        fields = "__all__"

    def validate(self, data):
        try:
            Server.objects.get(name=data['name'])
            raise serializers.ValidationError(f"server {data['name']} already created")
        except Server.DoesNotExist:
            return data 

class ServerChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        field = ['name', 'avatar']
