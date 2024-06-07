FROM node:20.14.0-buster as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=build /app .

RUN apk add --no-cache postgresql-client

COPY aivaluatedb.sql /docker-entrypoint-initdb.d/

EXPOSE 3000

CMD ["npm", "run", "dev"]