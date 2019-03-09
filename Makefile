export HOST_UID=$(shell id -u)
export HOST_GID=$(shell id -g)

DOCKER_COMPOSE_FILE_APP := ./docker/docker-compose.dev.yml
DOCKER_COMPOSE_APP  := docker-compose -f $(DOCKER_COMPOSE_FILE_APP)
DOCKER_COMPOSE_RUN_APP  := docker-compose -f $(DOCKER_COMPOSE_FILE_APP) run --no-deps

up: prepare
	$(DOCKER_COMPOSE_APP) up

down:
	$(DOCKER_COMPOSE_APP) down

clean: clean-containers clean-modules

clean-containers:
	@docker kill $$(docker ps -q) || : &&\
		docker rm $$(docker ps -qa) || : &&\
		docker rmi $$(docker images -q) || : &&\
		docker volume prune || : &&\
		make clean-volumes

clean-volumes:
	@docker volume rm $$(docker volume ls -q)

# Dependencies
prepare:
	@./docker/bin/spectrum node shared/install-dependencies.js

migration:
	@./docker/bin/spectrum yarn run db:migrate &&\
		./docker/bin/spectrum yarn run db:seed

# Entrypoints for ./bin/* commands
entrypoint-app-%:
	$(DOCKER_COMPOSE_RUN_APP) \
		$* \
		$(ARGS)

entrypoint-docker-compose:
	@$(DOCKER_COMPOSE_APP) $(ARGS)
