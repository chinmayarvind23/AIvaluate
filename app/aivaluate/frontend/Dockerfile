FROM node:20.14.0-buster as build

ENV NODE_ENV=development

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm cache clean --force
RUN npm install
RUN npm install vite@latest --save-dev
RUN npm install rollup@latest --save-dev

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]