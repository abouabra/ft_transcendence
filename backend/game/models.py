from django.db import models

class GameStats(models.Model):

    GAMES_CHOICES = (
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )

    user_id = models.IntegerField()
    game_name = models.CharField(choices=GAMES_CHOICES, max_length=20)

    current_elo = models.FloatField(default=25)
    peak_elo = models.FloatField(default=25)


    total_games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    games_drawn = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)

    total_time_spent = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)

    def __str__(self):
        return f"User: {self.user_id} => {self.game_name} Stats"
    
    class Meta:
        verbose_name_plural = "Game Stats"

class Game_History(models.Model):
    player1 = models.IntegerField()
    player2 = models.IntegerField()
    
    GAMES_CHOICES = (
        ("pong", "Pong"),
        ("space_invaders", "Space Invaders"),
        ("road_fighter", "Road Fighter"),
    )

    GAMES_TYPES = (
        ("ranked", "Ranked"),
        ("local", "Local"),
        ("ai", "AI"),
    )

    game_name = models.CharField(choices=GAMES_CHOICES, max_length=20)
    game_type = models.CharField(choices=GAMES_TYPES, max_length=20)

    player_1_score = models.IntegerField(default=0)
    player_2_score = models.IntegerField(default=0)

    player1_elo_change = models.IntegerField(default=0)
    player2_elo_change = models.IntegerField(default=0)
    
    winner = models.IntegerField(default=0)
    
    game_date = models.DateTimeField(auto_now_add=True)
    game_duration = models.IntegerField(default=0)


    def __str__(self):
        return f"{self.game_name} | {self.player1} vs {self.player2} => {self.player_1_score}:{self.player_2_score}"

    class Meta:
        verbose_name_plural = "Game History"