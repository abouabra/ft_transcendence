CURDIR := $(shell pwd)
export COMPOSE_PROJECT_PATH=$(CURDIR)

RED = \033[1;31m
GREEN = \033[1;32m
BLUE = \033[1;34m
YELLOW = \033[1;33m
BLINK = \033[5m
RESET = \033[0m

all: make_vault

make_vault: ascci
	@rm -rf $(CURDIR)/vault/
	@mkdir -p $(CURDIR)/vault/ $(CURDIR)/volumes/db_data/redis_data/ $(CURDIR)/volumes/db_data/user_management_db_data/ $(CURDIR)/volumes/db_data/chat_db_data/ $(CURDIR)/volumes/db_data/game_db_data/ $(CURDIR)/volumes/db_data/tournaments_db_data/
	@python3 generate_vault.py
	@printf "${GREEN}Vault generated please change the pre-filled values in the vault file then run '${RED}make build${GREEN}'${RESET}\n"

build: ascci
	@mkdir -p $(CURDIR)/vault/ $(CURDIR)/volumes/db_data/redis_data/ $(CURDIR)/volumes/db_data/user_management_db_data/ $(CURDIR)/volumes/db_data/chat_db_data/ $(CURDIR)/volumes/db_data/game_db_data/ $(CURDIR)/volumes/db_data/tournaments_db_data/
	@docker compose -f docker-compose.yml up -d --build

start: ascci
	@docker compose -f docker-compose.yml up -d

stop: ascci
	@docker compose -f docker-compose.yml stop

clean: ascci
	@docker compose -f docker-compose.yml down -v
#	@rm -rf $(CURDIR)/volumes/db_data/

fclean: ascci
	@docker compose -f docker-compose.yml down -v
	@docker system prune -af
	@rm -rf $(CURDIR)/volumes/db_data/
	@rm -rf $(CURDIR)/vault/


re: clean build
rebuild: fclean build
restart: stop start


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