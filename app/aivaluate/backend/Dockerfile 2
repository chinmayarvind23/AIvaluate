FROM node:20.14.0-buster as build

WORKDIR /app/aivaluate/backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 4000

#CMD sh -c "while ! nc -z $DB_HOST $DB_PORT; do sleep 1; done && node server.js"
CMD ["npm", "run", "dev"]