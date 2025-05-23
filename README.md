# ft_transcendence

## Overview

**ft_transcendence** is a full-stack web application that delivers a feature-rich, secure, and interactive arcade gaming experience online. It offers real-time multiplayer gaming, user authentication, chat, tournaments, leaderboards, personal dashboards, and advanced observability—all built on a robust modern microservices architecture.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Microservices Breakdown](#microservices-breakdown)
- [Infrastructure and Observability](#infrastructure-and-observability)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Configuration](#configuration)
- [License](#license)

---

## Features

- **Online Arcade Game:** Real-time multiplayer browser-based arcade gameplay.
- **Microservices Architecture:** Fully modular services for user management, chat, game logic, and tournaments.
- **Secure Authentication:** Uses Email/password and OAuth2 login with JWT-based session management.
- **Real-Time Communication:** WebSocket-based chat and realtime game states.
- **Chat Functionality:** Group and direct chat, channel/server structure, moderation, avatars, and user roles.
- **Tournaments & Leaderboards:** Organize/participate in tournaments, view global and personal rankings.
- **Personal Dashboards:** User dashboards for stats and account management.
- **Caching:** Redis-backed caching and pub/sub for real-time and high-performance features.
- **Observability:** Prometheus and Grafana for monitoring and metrics visualization, with cAdvisor for per-container stats.
- **API Gateway:** All HTTP and WebSocket traffic routed/scaled with Nginx reverse proxy and load balancing.
- **Secure Environment:** Automated secret and key generation via `generate_vault.py`.

---

## Tech Stack

- **Backend (per service):**
    - Python 3, Django, Django REST Framework
    - Django Channels (WebSockets)
    - PostgreSQL (per-service DB)
    - Redis (caching, session, pub/sub)
    - JWT & OAuth2 (authentication and access control)
- **Frontend:**
    - Vanilla JavaScript with a modular, component-oriented structure (custom elements)
    - Static asset serving via Nginx
- **API Gateway & Proxy:**
    - Nginx (reverse proxy, load balancer, API gateway)
- **Monitoring & Metrics:**
    - Prometheus (metrics)
    - Grafana (visualization)
    - cAdvisor, exporters (PostgreSQL, Redis)
- **DevOps:**
    - Docker & Docker Compose (orchestration)
    - `generate_vault.py` (environment variables, key management)

---

## Architecture

- **Microservices:** Distinct Django services for user management, chat, games, and tournaments—each with its own codebase, database, and env.
- **Inter-service Communication:** Redis for caching, pub/sub, and session storage.
- **Nginx:** Serves as the common entry point, managing SSL, balancing traffic, and exposing endpoints as API gateway.
- **Observability:** Prometheus and Grafana deliver comprehensive service and infrastructure metrics, with cAdvisor providing real-time resource usage on containers.

---

## Microservices Breakdown

### 1. User Management Service
- Django + REST Framework plus JWT/OAuth2 login
- Registration, authentication, user profile, account management
- Issues JWT tokens for secure API access across services

### 2. Chat Service
- Django + REST Framework + Channels for WebSockets
- Real-time group chats, direct messaging, public/private/protected chatrooms, server/channel model, moderation, avatars

### 3. Game Service
- Django + REST Framework + Channels for real-time multiplayer
- Arcade gameplay, matchmaking, state management, leaderboard integration

### 4. Tournaments Service
- Django + REST Framework
- Tournament creation, player registration, brackets, results, leaderboard integration

### Shared Features
- All services use their own PostgreSQL DB
- Redis is shared for caching, pub/sub, and real-time support
- All environments and secrets managed through `vault/` and generated automatically

---

## Infrastructure and Observability

- **Nginx:** Terminates SSL, balances load, and routes/reverses all web and websocket traffic
- **Monitoring:** Prometheus collects metrics from all core, infrastructure, and exporter containers
- **Dashboards:** Grafana provides ready-to-use panels for system health and tracking
- **Container Metrics:** cAdvisor exposes Docker/container-level resource stats
- **Vault & Secrets:** Use `generate_vault.py` to automate secret/key generation and population of env files in `vault/`

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3 (for `generate_vault.py` only)

### Setup & Run

1. **Clone the Repository**
    ```bash
    git clone https://github.com/abouabra/ft_transcendence
    cd ft_transcendence
    ```

2. **Generate Secrets & Keys**
    ```bash
    make make_vault
    ```

3. **Start All Services**
    ```bash
    make build
    ```

4. **Access Application**
    - Main: [https://localhost](https://localhost)
    - Grafana: [https://localhost/admin/grafana](http://localhost/admin/grafana)
    - Service admin (replace `<service_name>` with one of: `user_management_service`, `chat_service`, `game_service`, `tournaments_service`):  
      [https://localhost/admin/<service_name>/](https://localhost/admin/<service_name>/)
---

## Development Guide

- Backend code: `backend/` (chat_service, game_service, tournaments_service, user_management_service)
- Frontend code: `frontend/` (JavaScript modules, custom elements, CSS, assets)
- Infrastructure: `infrastructure/` (Nginx and monitoring configs)
- Secrets/Environment: `vault/`
- For updates to secrets/keys, re-run `generate_vault.py`

---

## Configuration

- Docker Compose (`docker-compose.yml`) ties together all services and infrastructure.
- All service configs and secrets securely in the `vault/` directory, generated by utility.
- Each backend service uses a dedicated DB container and env file.

---

## License

This project is provided for educational and demonstrative purposes only.
