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
    def validate(self, data):
        try:
            Tournament_History.objects.get(name=data['name'])
            raise serializers.ValidationError(f"Tournament {data['name']} already created")
        except Tournament_History.DoesNotExist:
            return data


class ShortTournamentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament_History
        fields = ["id", "name", "avatar", "game_name"]