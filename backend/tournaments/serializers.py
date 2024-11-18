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



class ProfileTournamentHistorySerializer(serializers.ModelSerializer):
    tournament_position = serializers.SerializerMethodField()

    class Meta:
        model = Tournament_History
        fields = ["id", "name", "avatar", "tournament_position"]

    def get_tournament_position(self, obj):
        user_id = self.context.get('user_id')
        if not user_id or user_id not in obj.members:
            return None

        if obj.status == "Waiting for players" or not obj.bracket_data:
            return None

        if obj.tournament_winner == user_id:
            return 1

        bracket_data = obj.bracket_data
        total_players = obj.total_number_of_players

        def find_player_match(matches):
            for match in matches:
                if user_id in match:
                    return match
            return None

        finals = bracket_data.get('finals', [])
        if finals:
            final_match = find_player_match(finals)
            if final_match:
                return 2  # Lost in finals = 2nd place

        semifinals = bracket_data.get('semifinals', [])
        if semifinals:
            semi_match = find_player_match(semifinals)
            if semi_match:
                return 3  # Lost in semifinals = 3rd place

        if total_players >= 8:
            quarterfinals = bracket_data.get('quarterfinals', [])
            if quarterfinals:
                quarter_match = find_player_match(quarterfinals)
                if quarter_match:
                    return 5  # Positions 5-8 for quarterfinal losers

        if total_players == 16:
            round_16 = bracket_data.get('round_16', [])
            if round_16:
                r16_match = find_player_match(round_16)
                if r16_match:
                    return 9  # Positions 9-16 for Round of 16 losers

        # If player is in members but not found in any checked rounds
        if user_id in obj.members:
            if total_players <= 4:
                return 4
            elif total_players <= 8:
                return 8
            else:
                return 16

        return None