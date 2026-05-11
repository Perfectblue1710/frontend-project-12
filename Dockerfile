FROM node:22-slim

RUN apt-get update && apt-get install -y bash make

WORKDIR /project

COPY package*.json ./
RUN npm install

COPY . .

RUN make build

EXPOSE 5001

CMD ["make", "start"]
