from django.db import models

class GameType(models.Model):
    name = models.CharField(max_length=100, unique=True)

class GameStats(models.Model):
    game_type = models.ForeignKey(GameType, on_delete=models.CASCADE)
    current_elo = models.FloatField(default=25)
    peak_elo = models.FloatField(default=25)
    total_time_spent = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.game_type.name} Stats"