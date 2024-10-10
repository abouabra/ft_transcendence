import re
from rest_framework import serializers
from .models import User

class SerializerSignup(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = '__all__'
    
    def validate(self, data):
        pattern = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
        if not pattern.match(data['password']):
            raise serializers.ValidationError({"Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."})
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            path_avatar=validated_data.get('path_avatar', '')
        )
        return user

class ValidEmail(serializers.Serializer):
    email = serializers.EmailField()