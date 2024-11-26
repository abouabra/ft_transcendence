from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.
class TournamentStats(models.Model):
    
    GAMES_CHOICES = (
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )

    user_id = models.IntegerField()
    game_name = models.CharField(choices=GAMES_CHOICES, max_length=20)

    total_games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Tournament Stats"

    def __str__(self):
        return f"User: {self.user_id} => {self.game_name} Stats"

class Tournament_History(models.Model):
    name = models.CharField(max_length=255)
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/tournament_avatars/default_tournament.jpg")
    qr_code = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/servers_qr_codes/default.jpg")

    tournament_winner = models.IntegerField(default=0)
    VISISBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
    )

    visibility = models.CharField(choices=VISISBILITY_CHOICES, max_length=20, default="public")
    password = models.CharField(max_length=255, blank=True, null=True)
    bracket_data = models.JSONField(default=dict)
    Nicknames = models.JSONField(default=dict)

    members = ArrayField(models.IntegerField(), default=list)

    GAMES_CHOICES = (
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )
    game_name = models.CharField(choices=GAMES_CHOICES, max_length=20)
    room_size = models.IntegerField(default=4)

    total_number_of_players = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = (
        ("Waiting for players", "Waiting for players"),
        ("Ended", "Ended"),
        ("In progress", "In progress"),
    )
    
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default="Waiting for players")

    def __str__(self):
        return f"{self.name} - {self.game_name} - {self.visibility} - {self.total_number_of_players} players"
    
    class Meta:
        verbose_name_plural = "Tournament History"
