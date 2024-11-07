from django.contrib import admin
from .models import TournamentStats, Tournament_Bracket, Tournament_History, TournamentRoom

admin.site.register(TournamentStats)
admin.site.register(Tournament_Bracket)
admin.site.register(Tournament_History)
admin.site.register(TournamentRoom)