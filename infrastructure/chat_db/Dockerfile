# Use the official PostgreSQL image
FROM postgres:16.4

COPY init_db.sh /docker-entrypoint-initdb.d/init_db.sh
RUN chmod +x /docker-entrypoint-initdb.d/init_db.sh

CMD ["postgres", "-c", "listen_addresses=0.0.0.0", "-c", "max_connections=100"]