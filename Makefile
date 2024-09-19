CURDIR := $(shell pwd)
export COMPOSE_PROJECT_PATH=$(CURDIR)

all: build

build: ascci
	@mkdir -p $(CURDIR)/volumes/db_data/redis_data/ $(CURDIR)/volumes/db_data/user_management_db_data/
	@docker compose -f docker-compose.yml up -d --build

start: ascci
	@docker compose -f docker-compose.yml up -d

stop: ascci
	@docker compose -f docker-compose.yml stop

clean: ascci
	@docker compose -f docker-compose.yml down -v

fclean: ascci
	@docker compose -f docker-compose.yml down -v
	@docker system prune -af
	@rm -rf $(CURDIR)/volumes/db_data/

re: clean build
rebuild: fclean build
restart: stop start

RED = \033[1;31m
GREEN = \033[1;32m
BLUE = \033[1;34m
YELLOW = \033[1;33m
BLINK = \033[5m
RESET = \033[0m


ascci:
	@clear
	@printf "$(GREEN) \n\
 ▄████▄   ██░ ██  ▄▄▄       ███▄ ▄███▓ ██▓███   ▄▄▄       ███▄    █  ██ ▄█▀ ██▓        ▒█████    █████▒     █████▒▓█████   ██████  ▄▄▄       ▄▄▄▄    ██▓    ▄▄▄       ███▄    █  ▄████▄   ▄▄▄       \n\
▒██▀ ▀█  ▓██░ ██▒▒████▄    ▓██▒▀█▀ ██▒▓██░  ██▒▒████▄     ██ ▀█   █  ██▄█▒ ▓██▒       ▒██▒  ██▒▓██   ▒    ▓██   ▒ ▓█   ▀ ▒██    ▒ ▒████▄    ▓█████▄ ▓██▒   ▒████▄     ██ ▀█   █ ▒██▀ ▀█  ▒████▄     \n\
▒▓█    ▄ ▒██▀▀██░▒██  ▀█▄  ▓██    ▓██░▓██░ ██▓▒▒██  ▀█▄  ▓██  ▀█ ██▒▓███▄░ ▒██░       ▒██░  ██▒▒████ ░    ▒████ ░ ▒███   ░ ▓██▄   ▒██  ▀█▄  ▒██▒ ▄██▒██░   ▒██  ▀█▄  ▓██  ▀█ ██▒▒▓█    ▄ ▒██  ▀█▄   \n\
▒▓▓▄ ▄██▒░▓█ ░██ ░██▄▄▄▄██ ▒██    ▒██ ▒██▄█▓▒ ▒░██▄▄▄▄██ ▓██▒  ▐▌██▒▓██ █▄ ▒██░       ▒██   ██░░▓█▒  ░    ░▓█▒  ░ ▒▓█  ▄   ▒   ██▒░██▄▄▄▄██ ▒██░█▀  ▒██░   ░██▄▄▄▄██ ▓██▒  ▐▌██▒▒▓▓▄ ▄██▒░██▄▄▄▄██  \n\
▒ ▓███▀ ░░▓█▒░██▓ ▓█   ▓██▒▒██▒   ░██▒▒██▒ ░  ░ ▓█   ▓██▒▒██░   ▓██░▒██▒ █▄░██████▒   ░ ████▓▒░░▒█░       ░▒█░    ░▒████▒▒██████▒▒ ▓█   ▓██▒░▓█  ▀█▓░██████▒▓█   ▓██▒▒██░   ▓██░▒ ▓███▀ ░ ▓█   ▓██▒ \n\
░ ░▒ ▒  ░ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ░  ░▒▓▒░ ░  ░ ▒▒   ▓▒█░░ ▒░   ▒ ▒ ▒ ▒▒ ▓▒░ ▒░▓  ░   ░ ▒░▒░▒░  ▒ ░        ▒ ░    ░░ ▒░ ░▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░░▒▓███▀▒░ ▒░▓  ░▒▒   ▓▒█░░ ▒░   ▒ ▒ ░ ░▒ ▒  ░ ▒▒   ▓▒█░ \n\
  ░  ▒    ▒ ░▒░ ░  ▒   ▒▒ ░░  ░      ░░▒ ░       ▒   ▒▒ ░░ ░░   ░ ▒░░ ░▒ ▒░░ ░ ▒  ░     ░ ▒ ▒░  ░          ░       ░ ░  ░░ ░▒  ░ ░  ▒   ▒▒ ░▒░▒   ░ ░ ░ ▒  ░ ▒   ▒▒ ░░ ░░   ░ ▒░  ░  ▒     ▒   ▒▒ ░ \n\
░         ░  ░░ ░  ░   ▒   ░      ░   ░░         ░   ▒      ░   ░ ░ ░ ░░ ░   ░ ░      ░ ░ ░ ▒   ░ ░        ░ ░       ░   ░  ░  ░    ░   ▒    ░    ░   ░ ░    ░   ▒      ░   ░ ░ ░          ░   ▒    \n\
░ ░       ░  ░  ░      ░  ░       ░                  ░  ░         ░ ░  ░       ░  ░       ░ ░                        ░  ░      ░        ░  ░ ░          ░  ░     ░  ░         ░ ░ ░            ░  ░ \n\
░                                                                                                                                                 ░                             ░                   \n\
                                                                                                                                                                                                    \n\
                                                                                                                                                                                                    \n\
                                                                                                                                                        $(RED)    by: abouabra, mbaanni, bel-kdio   \n\
                                                                                                                                                                                                    \n\
                                                                                                                                                                                                    \n\
                                                                                                                                                                                                    $(RESET)\n"