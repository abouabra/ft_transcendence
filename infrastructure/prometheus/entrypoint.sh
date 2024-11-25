#!/bin/sh

# Create temporary config file
cp /etc/alertmanager/alertmanager.yml /tmp/alertmanager.yml

# Replace environment variables
sed -i "s|\${EMAIL_HOST_USER}|$EMAIL_HOST_USER|g" /tmp/alertmanager.yml
sed -i "s|\${EMAIL_HOST_PASSWORD}|$EMAIL_HOST_PASSWORD|g" /tmp/alertmanager.yml
sed -i "s|\${EMAIL_TMP_HOST_USER}|$EMAIL_TMP_HOST_USER|g" /tmp/alertmanager.yml

# Start alertmanager with the processed config
echo "Starting Alertmanager with the following config:"
cat /tmp/alertmanager.yml
exec /bin/alertmanager --config.file=/tmp/alertmanager.yml "$@"