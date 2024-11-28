# Variables
DOCKER_COMPOSE = docker-compose
CONTAINER_API_DEV = api-dev
CONTAINER_API_PROD = api-prod
CONTAINER_UI_DEV = ui-dev
CONTAINER_UI_PROD = ui-prod
CONTAINER_CELERY = celery
CONTAINER_BEAT = celery_beat

# Commands
.PHONY: lint format setup-dev setup-prod changepassword logs build up stop down restart clean

# Code Quality
lint:
	cd api && poetry run ruff linter

format:
	cd api && poetry run ruff format .

# Setup
setup-dev:
	@docker exec -it $(CONTAINER_API_DEV) bash ./setup.sh

setup-prod:
	@docker exec -it $(CONTAINER_API_PROD) bash ./setup.sh

# Password Management
changepassword-dev:
	@docker exec -it $(CONTAINER_API_DEV) poetry run python manage.py changepassword admin
changepassword-prod:
	@docker exec -it $(CONTAINER_API_PROD) poetry run python manage.py changepassword admin

# Logs
logs:
	@$(DOCKER_COMPOSE) logs -f

log-backend-dev:
	@docker logs -f $(CONTAINER_API_DEV)

log-backend-prod:
	@docker logs -f $(CONTAINER_API_PROD)

log-frontend-dev:
	@docker logs -f $(CONTAINER_UI_DEV)

log-frontend-prod:
	@docker logs -f $(CONTAINER_UI_PROD)

log-worker:
	@docker logs -f $(CONTAINER_CELERY)

log-beat:
	@docker logs -f $(CONTAINER_BEAT)

# Docker Operations for Development
build-dev:
	@$(DOCKER_COMPOSE) --profile development build

up-dev:
	@$(DOCKER_COMPOSE) --profile development up -d

stop-dev:
	@$(DOCKER_COMPOSE) --profile development stop

down-dev:
	@$(DOCKER_COMPOSE) --profile development down

restart-dev:
	make build-dev && make down-dev && make up-dev

# Docker Operations for Production
build-prod:
	@$(DOCKER_COMPOSE) --profile production build

up-prod:
	@$(DOCKER_COMPOSE) --profile production up -d

stop-prod:
	@$(DOCKER_COMPOSE) --profile production stop

down-prod:
	@$(DOCKER_COMPOSE) --profile production down

restart-prod:
	make build-prod && make down-prod && make up-prod

# Cleanup
clean-pyc:
	@docker exec -it $(CONTAINER_API_DEV) bash -c "find . -name '*.pyc' -exec rm -f {} +; find . -name '*.pyo' -exec rm -f {} +; find . -name '__pycache__' -exec rm -rf {} +"

clean: clean-pyc
	@echo "Temporary files cleaned."
