FROM node:22-slim

WORKDIR /project

RUN apt-get update && apt-get install -y bash make

COPY package*.json ./
RUN npm install

COPY . .

RUN make build

EXPOSE 5001

CMD ["make", "start"]
HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/ || exit 1