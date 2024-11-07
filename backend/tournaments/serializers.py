from rest_framework import serializers
from .models import TournamentStats, Tournament_Bracket, Tournament_History, TournamentRoom

class TournamentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentStats
        fields = "__all__"

class TournamentBracketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament_Bracket
        fields = "__all__"

class TournamentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament_History
        fields = "__all__"
class TournamentRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentRoom
        fields = "__all__"
    def validate(self, data):
        try:
            TournamentRoom.objects.get(name=data['name'])
            raise serializers.ValidationError(f"Tournament {data['name']} already created")
        except TournamentRoom.DoesNotExist:
            return data

