# Use the official Redis image from the Docker Hub
FROM redis:8.0-M01

# Copy custom redis.conf if you have one (optional)
# COPY ./redis.conf /usr/local/etc/redis/redis.conf

# Expose the default Redis port
# EXPOSE 6379

# Start Redis with the updated configuration
# CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
CMD ["redis-server", "--bind", "0.0.0.0"]