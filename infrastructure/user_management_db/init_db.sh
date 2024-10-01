#!/bin/bash

# Wait for PostgreSQL to start
until psql -U postgres -c "SELECT 1;" >/dev/null 2>&1; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Check if the user exists
if ! psql -U postgres -t -c "SELECT 1 FROM pg_roles WHERE rolname='$USER_MANAGEMENT_POSTGRES_USER';" | grep -q 1; then
  echo "Creating user $USER_MANAGEMENT_POSTGRES_USER..."
  psql -U postgres -c "CREATE USER $USER_MANAGEMENT_POSTGRES_USER WITH PASSWORD '$USER_MANAGEMENT_POSTGRES_PASSWORD';"
else
  echo "User $USER_MANAGEMENT_POSTGRES_USER already exists."
fi

# Check if the database exists
if ! psql -U "$USER_MANAGEMENT_POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$USER_MANAGEMENT_POSTGRES_DB"; then
  echo "Creating database $USER_MANAGEMENT_POSTGRES_DB..."
  createdb -U "$USER_MANAGEMENT_POSTGRES_USER" "$USER_MANAGEMENT_POSTGRES_DB"
else
  echo "Database $USER_MANAGEMENT_POSTGRES_DB already exists."
fi

# Execute the original command
exec "$@"
