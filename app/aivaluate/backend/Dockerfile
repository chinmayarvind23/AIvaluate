FROM node:20.14.0-buster as build

WORKDIR /app

COPY package*.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]