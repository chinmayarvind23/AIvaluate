FROM node:20.14.0-buster as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN rm -rf node_modules package-lock.json

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]