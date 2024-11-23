from restframework import permissions


class AdministrateurPermission(permissions.BasePermission):
    message = 'Adding customers not allowed.'

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return False
