from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Meta:
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/avatars/default.jpg")
    status = models.CharField(max_length=255, blank=False, null=False, default="offline")

    def __str__(self):
        return f"{self.username}"
