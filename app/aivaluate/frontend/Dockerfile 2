FROM node:20.14.0-buster as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm install axios
RUN npm i -D @klarr-agency/circum-icons-react

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]