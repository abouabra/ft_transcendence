#!/bin/bash

export POSTGRES_DB=${CHAT_POSTGRES_DB}
export POSTGRES_USER=${CHAT_POSTGRES_USER}
export POSTGRES_PASSWORD=${CHAT_POSTGRES_PASSWORD}

exec /usr/local/bin/docker-entrypoint.sh "$@"