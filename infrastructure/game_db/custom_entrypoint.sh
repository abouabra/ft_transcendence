#!/bin/bash

export POSTGRES_DB=${GAME_POSTGRES_DB}
export POSTGRES_USER=${GAME_POSTGRES_USER}
export POSTGRES_PASSWORD=${GAME_POSTGRES_PASSWORD}

exec /usr/local/bin/docker-entrypoint.sh "$@"