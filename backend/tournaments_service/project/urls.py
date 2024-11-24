
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/tournaments_service/', admin.site.urls),
    path('api/tournaments/', include('tournaments.urls')),
    path('', include('django_prometheus.urls')),
]
