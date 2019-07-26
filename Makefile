
.PHONY: default init build watch serve dev

default: build

init:
	npm ci

build: init
	npm run build

watch: init
	npm run watch

serve: init
	npm run serve

dev: init
	npm run dev
