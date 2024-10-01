#!/bin/bash

# Wait for PostgreSQL to start
until psql -h localhost -U "$USER_MANAGEMENT_POSTGRES_USER" -c "SELECT 1" > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Create the database if it does not exist
psql -h localhost -U "$USER_MANAGEMENT_POSTGRES_USER" -c "CREATE DATABASE \"$USER_MANAGEMENT_POSTGRES_DB\";"

# Execute the original command
exec "$@"
