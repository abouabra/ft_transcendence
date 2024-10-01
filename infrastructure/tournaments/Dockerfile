FROM python:3.12.6-alpine3.20

RUN apk update && apk add --no-cache postgresql-client

WORKDIR /app

COPY requirements.txt /tmp/

RUN pip install --no-cache-dir -r /tmp/requirements.txt

EXPOSE 8003

ENTRYPOINT ["/app/entrypoint.sh"]