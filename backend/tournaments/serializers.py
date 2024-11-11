from rest_framework import serializers
from .models import TournamentStats, Tournament_History

class TournamentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentStats
        fields = "__all__"


class TournamentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament_History
        fields = "__all__"

class ShortTournamentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament_History
        fields = ["id", "name", "avatar", "game_name"]