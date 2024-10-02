#!/usr/bin/env python3

import os
import subprocess
import secrets

def generate_random_password(length=16):
    return secrets.token_urlsafe(length)

VAULT_DIR = os.path.join(os.getenv("COMPOSE_PROJECT_PATH"), "vault")
assert os.path.exists(VAULT_DIR), f"Vault directory not found: {VAULT_DIR}"


def generate_env(type):
    file_names = {
        "env": ".env",
        "user_management_env": ".user_management_env",
        "chat_env": ".chat_env",
        "game_env": ".game_env",
        "tournaments_env": ".tournaments_env",
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
    
    elif type == "user_management_env":
        env_content = f"""# This file contains the environment variables for User Management service

# INTRA API settings
INTRA_UID=
INTRA_SECRET=
INTRA_CALLBACK_URI=
INTRA_TOKEN_URL=
INTRA_AUTH_URL=

# Email settings
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=user@example.com
EMAIL_HOST_PASSWORD={generate_random_password()}

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=True

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=adminpass

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres user management
USER_MANAGEMENT_POSTGRES_USER=user_management_user
USER_MANAGEMENT_POSTGRES_PASSWORD={generate_random_password()}
USER_MANAGEMENT_POSTGRES_DB=user_management_database
"""

    elif type == "chat_env":
        env_content = f"""# This file contains the environment variables for Chat service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=True

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=adminpass

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres chat service
CHAT_POSTGRES_USER=chat_user
CHAT_POSTGRES_PASSWORD={generate_random_password()}
CHAT_POSTGRES_DB=chat_database
"""

    elif type == "game_env":
        env_content = f"""# This file contains the environment variables for Game service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=True

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=adminpass

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres game service
GAME_POSTGRES_USER=game_user
GAME_POSTGRES_PASSWORD={generate_random_password()}
GAME_POSTGRES_DB=game_database
"""

    elif type == "tournaments_env":
        env_content = f"""# This file contains the environment variables for Tournaments service

# Django settings
SECRET_KEY="{generate_random_password(50)}"
DEBUG=True

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=adminpass

# Postgres root user
POSTGRES_PASSWORD={generate_random_password()}

# Postgres tournaments service
TOURNAMENTS_POSTGRES_USER=tournaments_user
TOURNAMENTS_POSTGRES_PASSWORD={generate_random_password()}
TOURNAMENTS_POSTGRES_DB=tournaments_database
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
    generate_env(type="user_management_env")
    generate_env(type="chat_env")
    generate_env(type="game_env")
    generate_env(type="tournaments_env")

if __name__ == "__main__":
    generate_vault()
