#!/bin/sh

# Function to check if the database is ready
wait_for_db() {
    local db_host="$1"
    local db_port="$2"
    
    echo "Waiting for database at $db_host:$db_port to be ready..."
    while ! pg_isready -h "$db_host" -p "$db_port" -U "$POSTGRES_USER"; do
        sleep 2
    done
    echo "Database is ready!"
}


wait_for_db "game-db-container" "5435"


# Check if there are unapplied migrations and apply them if needed
if [ "$(python manage.py showmigrations --plan | grep '\[ \]')" ]; then
    echo "Applying migrations..."
    python manage.py migrate --noinput
else
    echo "No migrations to apply."
fi

# Check if a superuser exists, if not, create one using environment variables
if [ "$(python manage.py shell -c 'from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(is_superuser=True).exists())')" = "False" ]; then
    echo "Creating superuser..."
    python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('${DJANGO_SUPERUSER_USERNAME}', '${DJANGO_SUPERUSER_EMAIL}', '${DJANGO_SUPERUSER_PASSWORD}')"
else
    echo "Superuser already exists. Skipping creation."
fi

# Start the Django development server
exec python manage.py runserver 0.0.0.0:8002
