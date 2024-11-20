from rest_framework import serializers
from .models import User, Notification
import re


def password_validation(password):
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long")

    if not re.search(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$", password):
        raise serializers.ValidationError(
            "Password must have at least one uppercase letter, one lowercase letter and one number"
        )

    return password



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[password_validation])
    password_confirmation = serializers.CharField(write_only=True, validators=[password_validation])


    class Meta:
        model = User
        fields = "__all__"

    def validate(self, attrs):
        password = attrs.pop("password")
        password_confirmation = attrs.pop("password_confirmation")

        if password != password_confirmation:
            raise serializers.ValidationError("Passwords don't match")

        attrs["password"] = password
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ShortUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar", "status", "profile_banner"]


class NotificationSerializer(serializers.ModelSerializer):
    sender = ShortUserSerializer()
    receiver = ShortUserSerializer()

    class Meta:
        model = Notification
        fields = "__all__"

    def create(self, validated_data):
        return Notification.objects.create(**validated_data)
    


class SerializerSignup(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = '__all__'
    
    def validate(self, data):
        pattern = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
        if not pattern.match(data['password']):
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."})
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class ValidEmail(serializers.Serializer):
    email = serializers.EmailField()

class ProfileUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar"]
