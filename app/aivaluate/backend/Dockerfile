FROM node:20.14.0-buster

WORKDIR /app/aivaluate/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y netcat

EXPOSE 4000

CMD ["npm", "start"]