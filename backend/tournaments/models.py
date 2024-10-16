from django.db import models

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

class Tournament_Bracket(models.Model):
    tournament = models.ForeignKey("Tournament_History", on_delete=models.CASCADE)
    #i want Round choices to be like quarterfinals, semifinals, finals
    ROUND_CHOICES = (
        ("round_of_16", "Round of 16"),
        ("quarterfinals", "Quarterfinals"),
        ("semifinals", "Semifinals"),
        ("finals", "Finals"),
    )

    
    round_name = models.CharField(choices=ROUND_CHOICES, max_length=20, default="round_of_16")
    game_id = models.IntegerField()
    
    def __str__(self):
        return f"Tournament: {self.tournament.name} - Round: {self.round_name} - Game: {self.game_id}"
    class Meta:
        verbose_name_plural = "Tournament Brackets"

class Tournament_History(models.Model):
    name = models.CharField(max_length=255)
    avatar = models.CharField(max_length=255, blank=False, null=False, default="/assets/images/tournament_avatars/default.jpg")

    VISISBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
    )


    visibility = models.CharField(choices=VISISBILITY_CHOICES, max_length=20, default="public")
    password = models.CharField(max_length=255, blank=True, null=True)

    GAMES_CHOICES = (
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )
    game_name = models.CharField(choices=GAMES_CHOICES, max_length=20)


    total_number_of_players = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, default="Waiting for players")

    def __str__(self):
        return f"{self.name} - {self.game_name} - {self.visibility} - {self.total_number_of_players} players"
    
    class Meta:
        verbose_name_plural = "Tournament History"