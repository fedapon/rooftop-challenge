prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

stop down:
	docker-compose down