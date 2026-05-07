PORT=5001

install:
	npm install && cd frontend && npm install

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist -p $(PORT)

test:
	DISABLE_ESLINT_PLUGIN=true npx playwright test

.PHONY: install build start test
