
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/user_management_service/', admin.site.urls),
    path('api/auth/', include('user_management.urls')),
    path('oauth/', include('social_django.urls', namespace='social')),
]
