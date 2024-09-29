FROM python:3.12.6-alpine3.20

RUN apk update && apk add postgresql-dev

WORKDIR /app

CMD ["/bin/sh", "-c", "pip install -r requirements.txt && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]