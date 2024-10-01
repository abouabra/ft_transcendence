#!/bin/bash

# Wait for PostgreSQL to start
until psql -U $GAME_POSTGRES_USER -c "SELECT 1;" >/dev/null 2>&1; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Check if the database exists
if ! psql -U "$GAME_POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$GAME_POSTGRES_DB"; then
  echo "Creating database $GAME_POSTGRES_DB..."
  createdb -U "$GAME_POSTGRES_USER" "$GAME_POSTGRES_DB"
else
  echo "Database $GAME_POSTGRES_DB already exists."
fi

# Execute the original command
exec "$@"
