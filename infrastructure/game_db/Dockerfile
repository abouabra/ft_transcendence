# Use the official PostgreSQL image
FROM postgres:16.4


EXPOSE 5435

ENV POSTGRES_PASSWORD=${GAME_POSTGRES_PASSWORD}

# Copy your custom script
COPY init_db.sh /docker-entrypoint-initdb.d/init_db.sh
RUN chmod +x /docker-entrypoint-initdb.d/init_db.sh

COPY custom_entrypoint.sh /usr/local/bin/custom_entrypoint.sh
RUN chmod +x /usr/local/bin/custom_entrypoint.sh
ENTRYPOINT ["/usr/local/bin/custom_entrypoint.sh"]


# Run PostgreSQL server
CMD ["postgres", "-c", "listen_addresses=0.0.0.0", "-c", "max_connections=100", "-p", "5435"]
