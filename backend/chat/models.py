from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.hashers import make_password, check_password
# Create your models here.
class Server(models.Model):
    # direct value to take = iduser 1 + iduser2 sorted so we know the communicated party
    name = models.CharField(max_length=255) 
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/server_avatars/default.jpg")
    qr_code = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/servers_qr_codes/default_qr_code.png")

    VISISBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
        ("protected", "Protected"),
    )

    visibility = models.CharField(choices=VISISBILITY_CHOICES, max_length=255, default="public")
    password = models.CharField(max_length=255, blank=True, null=True)
    def set_passwd(self, passwd):
        self.password = make_password(passwd)
    def check_passwd(self, passwd):
        return check_password(passwd, self.password)

    members = ArrayField(models.IntegerField(), blank=True, default=list)
    staffs = ArrayField(models.IntegerField(), blank=True, default=list)
    banned = ArrayField(models.IntegerField(), blank=True, default=list)

    def add_member(self, member_id):
        self.members.append(member_id)
        self.save()
    
    def remove_member(self, member_id):
        self.members.remove(member_id)
        self.save()


    def __str__(self):
        return f"{self.name} - {self.visibility} - {len(self.members)} members"
    

class Message(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='server_message')
    sender_id = models.IntegerField()
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    blocked = ArrayField(models.IntegerField(), blank=True, default=list)
    def __str__(self):
        return f"{self.server.name} - {self.sender_id} - {self.timestamp}"
