from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.utils.translation import gettext_lazy as _
from .models import User

# class CustomUserAdmin(UserAdmin):
#     change_password_form = AdminPasswordChangeForm
#     change_user_password_template = None

#     def change_view(self, request, object_id, form_url='', extra_context=None):
#         self.change_form_template = self.change_user_password_template
#         return super().change_view(request, object_id, form_url, extra_context)

# admin.site.register(User, CustomUserAdmin)


admin.site.register(User)