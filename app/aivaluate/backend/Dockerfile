FROM node:20.14.0-buster as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Debugging lines to list directory contents
RUN ls -l /app
RUN ls -l /app/views

EXPOSE 5432

CMD ["node", "server.js"]