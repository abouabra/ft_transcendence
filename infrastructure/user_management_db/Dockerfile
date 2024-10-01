FROM postgres:16.4

EXPOSE 5432

# Copy your custom script
COPY create_db.sh /docker-entrypoint-initdb.d/create_db.sh
RUN chmod +x /docker-entrypoint-initdb.d/create_db.sh

# Use the default entrypoint and append your custom script
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres", "-c", "listen_addresses=0.0.0.0", "-c", "max_connections=100"]
