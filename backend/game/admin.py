from django.contrib import admin
from .models import GameStats, Game_History
from django.contrib import admin
from .models import GameStats

class GameStatsAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'game_name', 'current_elo', 'total_games_played', 'games_won', 'games_drawn', 'games_lost', 'total_time_spent', 'total_score', 'created_at')

    fields = ('user_id', 'game_name', 'current_elo', 'total_games_played', 'games_won', 'games_drawn', 'games_lost', 'total_time_spent', 'total_score', 'created_at')

admin.site.register(GameStats, GameStatsAdmin)
admin.site.register(Game_History)
