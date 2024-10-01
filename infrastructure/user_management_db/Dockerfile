# Use the official PostgreSQL image
FROM postgres:16.4


EXPOSE 5432


# Run PostgreSQL server
CMD ["postgres", "-c", "listen_addresses=0.0.0.0", "-c", "max_connections=100"]
