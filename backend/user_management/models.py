from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    class Meta:
        verbose_name_plural = "Users"

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return f"{self.username}"
