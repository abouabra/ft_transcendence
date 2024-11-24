
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/chat_service/', admin.site.urls),
    path('api/chat/', include('chat.urls')),
    path('', include('django_prometheus.urls')),
]
