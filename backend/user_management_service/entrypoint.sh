#!/bin/sh

# Function to check if the database is ready
wait_for_db() {
    local db_host="$1"
    local db_port="$2"
    
    echo "Waiting for database at $db_host:$db_port to be ready..."
    while ! pg_isready -h "$db_host" -p "$db_port" -U "$USER_MANAGEMENT_POSTGRES_USER"; do
        sleep 2
    done
    echo "Database is ready!"
}

# Initialize the database and create users without stats initialization
init_db_and_users() {
    # Check and apply migrations
    if [ "$(python manage.py showmigrations --plan | grep '\[ \]')" ]; then
        echo "Applying migrations..."
        python manage.py migrate --noinput
    else
        echo "No migrations to apply."
    fi

    if [ "$(python manage.py shell -c 'from user_management.models import User; print(User.objects.filter(is_superuser=True).exists())')" = "False" ]; then
        echo "Creating users without initializing stats..."
        python manage.py shell -c "
from user_management.models import User
admin_user = User.objects.create_superuser('${DJANGO_SUPERUSER_USERNAME}', '${DJANGO_SUPERUSER_EMAIL}', '${DJANGO_SUPERUSER_PASSWORD}')
local_user = User.objects.create_user('${DJANGO_LOCAL_USER_USERNAME}', '${DJANGO_LOCAL_USER_EMAIL}', '${DJANGO_LOCAL_USER_PASSWORD}')
local_user.is_staff = True
local_user.save()
        "
        init_user_stats_delayed
    else
        echo "Users already exist. Skipping creation."
    fi
}

# Function to initialize user stats after services are ready
init_user_stats_delayed() {
    (
        # First wait for our own service to be up
        echo "Waiting for user management service to be available..."
        while true; do
            status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/auth/)
            if [ "$status_code" = "404" ]; then
                echo "User management service is up!"
                break
            else
                echo "User management service not ready (status: $status_code). Retrying in 2 seconds..."
                sleep 2
            fi
        done

        # Then wait for game service
        echo "User management service is up, waiting for game service..."
        while true; do
            status_code=$(curl -s -o /dev/null -w "%{http_code}" -k "https://nginx-container/api/game/")
            if [ "$status_code" = "404" ]; then
                echo "Game service is ready. Initializing user stats..."
                python manage.py shell -c "
from user_management.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from user_management.utils import init_user_stats
from types import SimpleNamespace

# Initialize stats for admin user
admin_user = User.objects.get(username='${DJANGO_SUPERUSER_USERNAME}')
access_token = str(RefreshToken.for_user(admin_user).access_token)
dummy_request = SimpleNamespace(COOKIES={'access_token': access_token})
init_user_stats(dummy_request, admin_user.id)

# Initialize stats for local user
local_user = User.objects.get(username='${DJANGO_LOCAL_USER_USERNAME}')
access_token = str(RefreshToken.for_user(local_user).access_token)
dummy_request = SimpleNamespace(COOKIES={'access_token': access_token})
init_user_stats(dummy_request, local_user.id)
                "
                echo "User stats initialization completed."
                break
            else
                echo "Game service not ready (status: $status_code). Retrying in 3 seconds..."
                sleep 3
            fi
        done
    ) &
}

# Main execution flow
wait_for_db "user-management-db-container" "5432"
init_db_and_users


# Start the Django development server
exec python manage.py runserver 0.0.0.0:8000