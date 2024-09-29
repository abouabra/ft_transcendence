from django.contrib import admin
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.utils.translation import gettext_lazy as _
from .models import User, Notification
from django.contrib.auth.admin import UserAdmin



class CustomUserAdmin(UserAdmin):
    change_password_form = AdminPasswordChangeForm
    change_user_password_template = None

    # Define the fields to display in the admin panel for each section
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'avatar', 'status')}),
        ('Game Info', {'fields': ('is_playing', 'friends')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    def change_view(self, request, object_id, form_url='', extra_context=None):
        self.change_form_template = self.change_user_password_template
        return super().change_view(request, object_id, form_url, extra_context)




admin.site.register(User, CustomUserAdmin)


admin.site.register(Notification)
