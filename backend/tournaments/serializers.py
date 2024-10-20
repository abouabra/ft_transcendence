from rest_framework import serializers
from .models import TournamentStats, Tournament_Bracket, Tournament_History

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
