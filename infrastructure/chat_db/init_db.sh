#!/bin/bash

# Wait for PostgreSQL to start
until psql -U $CHAT_POSTGRES_USER -c "SELECT 1;" >/dev/null 2>&1; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Check if the database exists
if ! psql -U "$CHAT_POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$CHAT_POSTGRES_DB"; then
  echo "Creating database $CHAT_POSTGRES_DB..."
  createdb -U "$CHAT_POSTGRES_USER" "$CHAT_POSTGRES_DB"
else
  echo "Database $CHAT_POSTGRES_DB already exists."
fi

# Execute the original command
exec "$@"
