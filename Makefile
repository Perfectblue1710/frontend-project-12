install:
	npm ci
	cd frontend && npm ci

build:
	cd frontend && npm run build

start:
	npx @hexlet/chat-server -s ./frontend/dist

.PHONY: install build start
