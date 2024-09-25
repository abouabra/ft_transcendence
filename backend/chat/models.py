from django.db import models
from django.contrib.postgres.fields import ArrayField # NOTE: Use this for PostgreSQL

# Create your models here.
class Server(models.Model):
    # direct value to take = iduser 1 + iduser2 sorted so we know the communicated party
    name = models.CharField(max_length=255) 
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/server_avatars/default.jpg")

    VISISBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
        ("protected", "Protected"),
    )

    visibility = models.CharField(choices=VISISBILITY_CHOICES, max_length=255, default="public")
    password = models.CharField(max_length=255, blank=True, null=True)
    
    
    # members = models.JSONField(default=list, blank=True) # NOTE: Use this for SQLite
    members = ArrayField(models.IntegerField(), blank=True, default=list)

    def add_member(self, member_id):
        self.members.append(member_id)
        self.save()
    
    def remove_member(self, member_id):
        self.members.remove(member_id)
        self.save()


    def __str__(self):
        return f"{self.name} - {self.visibility} - {len(self.members)} members"
    

class Message(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    sender_id = models.IntegerField()
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.server.name} - {self.sender_id} - {self.timestamp}"