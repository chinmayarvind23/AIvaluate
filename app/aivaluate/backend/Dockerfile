FROM node:20.14.0-buster as build

WORKDIR /app/aivaluate/backend


RUN apt-get update && apt-get install -y netcat

RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# CMD sh -c "while ! nc -z $DB_HOST $DB_PORT; do sleep 1; done && node server.js"