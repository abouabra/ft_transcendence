from django.contrib import admin
from .models import TournamentStats, Tournament_Bracket, Tournament_History, TournamentRoom, MatchTournament

admin.site.register(TournamentStats)
admin.site.register(Tournament_Bracket)
admin.site.register(Tournament_History)
admin.site.register(TournamentRoom)
admin.site.register(MatchTournament)