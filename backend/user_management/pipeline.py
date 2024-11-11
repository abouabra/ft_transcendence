from django.contrib.auth import get_user_model
from social_core.exceptions import AuthAlreadyAssociated

def link_to_existing_user(backend, uid, user=None, *args, **kwargs):
    User = get_user_model()
    if user:
        print("here")
        return {'is_new': False}
    try:
        email = kwargs['details'].get('email')
        existing_user = User.objects.get(email=email)
        return {'user': existing_user, 'is_new': False}
    except User.DoesNotExist:
        return None
    except AuthAlreadyAssociated:
        raise AuthAlreadyAssociated("This account is already in use.")
