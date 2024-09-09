from rest_framework import serializers
from .models import User
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
        # fields = ["id", "username", "email", "password", "password_confirmation", "is_staff"]
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



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = User.objects.filter(username=username).first()

            if user is None:
                raise serializers.ValidationError("User not found")

            if not user.check_password(password):
                raise serializers.ValidationError("Incorrect password")

            if not user.is_active:
                raise serializers.ValidationError("User is not active")

            return {"user": user}

        raise serializers.ValidationError("Username and password are required")

