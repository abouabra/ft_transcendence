
all: build

build:
	@mkdir -p /Users/abouabra/Projects/ft_transcendence/volumes/db_data/chat_db_data/ /Users/abouabra/Projects/ft_transcendence/volumes/db_data/user_management_db_data/
	@docker compose -f docker-compose.yml up -d --build

start:
	@docker compose -f docker-compose.yml up -d

stop:
	@docker compose -f docker-compose.yml stop


fclean:
	@docker compose -f docker-compose.yml down -v
	@docker system prune -af
	@rm -rf /Users/abouabra/Projects/ft_transcendence/volumes/db_data/

re: stop start

RED = \033[1;31m
GREEN = \033[1;32m
BLUE = \033[1;34m
YELLOW = \033[1;33m
BLINK = \033[5m
RESET = \033[0m