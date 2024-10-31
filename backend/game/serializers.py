from rest_framework import serializers
from .models import GameStats, Game_History

class GameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameStats
        fields = "__all__"

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameStats
        fields = ["user_id", "current_elo"]

class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Game_History
        fields = "__all__"


class ShortGameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Game_History
        fields = ["id", "player1", "player2", "game_name", "game_type", "has_ended"]

