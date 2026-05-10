install:
	cd frontend && npm install
	cd frontend && npm install
	# Альтернатива:
	# npm install --prefix frontend
	# npm install

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

.PHONY: install build start
