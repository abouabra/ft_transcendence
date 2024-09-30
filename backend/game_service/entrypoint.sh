#!/bin/sh

# Check if there are unapplied migrations and apply them if needed
if [ "$(python manage.py showmigrations --plan | grep '\[ \]')" ]; then
    echo "Applying migrations..."
    python manage.py migrate --noinput
else
    echo "No migrations to apply."
fi

# Start the Django development server
exec python manage.py runserver 0.0.0.0:8002
