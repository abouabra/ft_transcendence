#!/usr/bin/env python3

import os
import subprocess
import secrets

def generate_random_password(length=16):
    return secrets.token_urlsafe(length)

VAULT_DIR = os.path.join(os.getenv("COMPOSE_PROJECT_PATH"), "vault")
assert os.path.exists(VAULT_DIR), f"Vault directory not found: {VAULT_DIR}"

ENV_DATA = {
    "user_management": {
        "POSTGRES_USER": "user_management_user",
        "POSTGRES_DB": "user_management_database",
        "POSTGRES_PASSWORD": generate_random_password(),
    },
    "chat": {
        "POSTGRES_USER": "chat_user",
        "POSTGRES_DB": "chat_database",
        "POSTGRES_PASSWORD": generate_random_password(),
    },
    "game": {
        "POSTGRES_USER": "game_user",
        "POSTGRES_DB": "game_database",
        "POSTGRES_PASSWORD": generate_random_password(),
    },
    "tournaments": {
        "POSTGRES_USER": "tournaments_user",
        "POSTGRES_DB": "tournaments_database",
        "POSTGRES_PASSWORD": generate_random_password(),
    },
}

def generate_env(type):
    file_names = {
        "env": ".env",
        "user_management_env": ".user_management_env",
        "chat_env": ".chat_env",
        "game_env": ".game_env",
        "tournaments_env": ".tournaments_env",
        "postgres_exporter_env": ".postgres_exporter_env",
    }

    if type not in file_names:
        print(f"Unknown type: {type}")
        return
    
    file_name = file_names[type]
    file_path = os.path.join(VAULT_DIR, file_name)
    env_content = ""

    if type == "env":
        env_content = f"""# This file contains the common environment variables for all the services

# Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD={generate_random_password()}

"""
    elif type == "postgres_exporter_env":
        env_content = f"""# This file contains the environment variables for Postgres Exporter service
# Postgres exporter
DATA_SOURCE_NAME=postgresql://{ENV_DATA["user_management"]["POSTGRES_USER"]}:{ENV_DATA["user_management"]["POSTGRES_PASSWORD"]}@user-management-db-container:5432/user_management_database?sslmode=disable,postgresql://{ENV_DATA["chat"]["POSTGRES_USER"]}:{ENV_DATA["chat"]["POSTGRES_PASSWORD"]}@chat-db-container:5434/chat_database?sslmode=disable,postgresql://{ENV_DATA["game"]["POSTGRES_USER"]}:{ENV_DATA["game"]["POSTGRES_PASSWORD"]}@game-db-container:5435/game_database?sslmode=disable,postgresql://{ENV_DATA["tournaments"]["POSTGRES_USER"]}:{ENV_DATA["tournaments"]["POSTGRES_PASSWORD"]}@tournaments-db-container:5436/tournaments_database?sslmode=disable        
        """
    
    elif type == "user_management_env":
        env_content = f"""# This file contains the environment variables for User Management service

# INTRA API settings
INTRA_UID="INTRA_UID"
INTRA_SECRET="INTRA_SECRET"


# GOOGLE API settings
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY="SOCIAL_AUTH_GOOGLE_OAUTH2_KEY"
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET="SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET"

# Email settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=fesablanca111@gmail.com
EMAIL_HOST_PASSWORD=ptzojrgtqnabmacx

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=False

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin #generate_random_password()

DJANGO_LOCAL_USER_USERNAME=local_user
DJANGO_LOCAL_USER_EMAIL=local_user@example.com
DJANGO_LOCAL_USER_PASSWORD=local_user #generate_random_password()

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres user management
USER_MANAGEMENT_POSTGRES_USER={ENV_DATA["user_management"]["POSTGRES_USER"]}
USER_MANAGEMENT_POSTGRES_PASSWORD={ENV_DATA["user_management"]["POSTGRES_PASSWORD"]}
USER_MANAGEMENT_POSTGRES_DB={ENV_DATA["user_management"]["POSTGRES_DB"]}
"""

    elif type == "chat_env":
        env_content = f"""# This file contains the environment variables for Chat service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=False

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin #generate_random_password()

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres chat service
CHAT_POSTGRES_USER={ENV_DATA["chat"]["POSTGRES_USER"]}
CHAT_POSTGRES_PASSWORD={ENV_DATA["chat"]["POSTGRES_PASSWORD"]}
CHAT_POSTGRES_DB={ENV_DATA["chat"]["POSTGRES_DB"]}
"""

    elif type == "game_env":
        env_content = f"""# This file contains the environment variables for Game service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=False

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin #generate_random_password()

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres game service
GAME_POSTGRES_USER={ENV_DATA["game"]["POSTGRES_USER"]}
GAME_POSTGRES_PASSWORD={ENV_DATA["game"]["POSTGRES_PASSWORD"]}
GAME_POSTGRES_DB={ENV_DATA["game"]["POSTGRES_DB"]}
"""

    elif type == "tournaments_env":
        env_content = f"""# This file contains the environment variables for Tournaments service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=False

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin #generate_random_password()

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres tournaments service
TOURNAMENTS_POSTGRES_USER={ENV_DATA["tournaments"]["POSTGRES_USER"]}
TOURNAMENTS_POSTGRES_PASSWORD={ENV_DATA["tournaments"]["POSTGRES_PASSWORD"]}
TOURNAMENTS_POSTGRES_DB={ENV_DATA["tournaments"]["POSTGRES_DB"]}
"""


    with open(file_path, "w") as f:
        f.write(env_content)
        print(f"Generated {file_name} with random passwords.")

def generate_vault():
    # Generate domain.crt and domain.key
    subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:4096", "-keyout", f"{os.path.join(VAULT_DIR, 'domain.key')}", "-out", f"{os.path.join(VAULT_DIR, 'domain.crt')}", "-sha256", "-days", "3650", "-nodes", "-subj", "/C=MA/ST=Tanger-Tetouan-Al Hoceima/L=Martil/O=1337/OU=1337MED/CN=ft_transcendence"])

    # Generate public.key and private.key
    subprocess.run(["openssl", "genrsa", "-out", f"{os.path.join(VAULT_DIR, 'private.key')}", "2048"])
    subprocess.run(["openssl", "rsa", "-in", f"{os.path.join(VAULT_DIR, 'private.key')}", "-outform", "PEM", "-pubout", "-out", f"{os.path.join(VAULT_DIR, 'public.key')}"])

    # Generate .env files
    generate_env(type="env")
    generate_env(type="postgres_exporter_env")
    generate_env(type="user_management_env")
    generate_env(type="chat_env")
    generate_env(type="game_env")
    generate_env(type="tournaments_env")

if __name__ == "__main__":
    generate_vault()
