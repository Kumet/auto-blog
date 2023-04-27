default: | help

DC = docker-compose
SITE_NAME = api

up:  ## コンテナ立ち上げ
	@$(DC) up

build:  ## コンテナをビルド
	@$(DC) build

shell:  ## コンテナ内のシェルに入る
	@$(DC) exec $(SITE_NAME) bash

lint:  ## リント
	@$(DC) run --rm $(SITE_NAME) flake8 .

format:  ## 自動フォーマット
	@$(DC) run --rm $(SITE_NAME) sh -c "autoflake --remove-all-unused-imports --recursive --remove-unused-variables --in-place . && black . && isort ."


help:  ## Show all of tasks
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
