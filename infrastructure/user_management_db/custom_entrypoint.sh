#!/bin/bash

export POSTGRES_DB=my_database
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=mysecretpassword

echo "export POSTGRES_DB=${USER_MANAGEMENT_POSTGRES_DB}" >> /root/.bashrc
echo "export POSTGRES_USER=${USER_MANAGEMENT_POSTGRES_USER}" >> /root/.bashrc
echo "export POSTGRES_PASSWORD=${USER_MANAGEMENT_POSTGRES_PASSWORD}" >> /root/.bashrc

echo "export POSTGRES_DB=${USER_MANAGEMENT_POSTGRES_DB}" >> /etc/environment
echo "export POSTGRES_USER=${USER_MANAGEMENT_POSTGRES_USER}" >> /etc/environment
echo "export POSTGRES_PASSWORD=${USER_MANAGEMENT_POSTGRES_PASSWORD}" >> /etc/environment

echo "POSTGRES_DB: ${POSTGRES_DB}"
echo "POSTGRES_USER: ${POSTGRES_USER}"
echo "POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}"

exec /usr/local/bin/docker-entrypoint.sh "$@"