from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Meta:
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/avatars/default.jpg")
    status = models.CharField(max_length=255, blank=False, null=False, default="offline")

    PLAYING_CHOICES = (
        (None, None),
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )

    is_playing = models.CharField(choices=PLAYING_CHOICES, max_length=255, blank=True, null=True)

    friends = models.ManyToManyField("self", blank=True, symmetrical=False)

    def __str__(self):
        return f"{self.username}"



class Notification(models.Model):
    class Meta:
        verbose_name_plural = "Notifications"

    NOTIFICATION_CHOICES = (
        ("game_invitation", "Game Invitation"),
        ("friend_request", "Friend Request"),
        # ("congrats", "Congratulations"),
        ("strike", "Strike"),
    )

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    type = models.CharField(choices=NOTIFICATION_CHOICES, max_length=255)

    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} : {self.type}"