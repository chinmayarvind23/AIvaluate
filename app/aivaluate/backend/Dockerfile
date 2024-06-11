FROM node:20.14.0-buster as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 4000

CMD ["node", "server.js"]