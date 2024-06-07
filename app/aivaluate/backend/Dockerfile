FROM node:14.17.0-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:14.17.0-alpine

COPY --from=build /app .

RUN apk add --no-cache postgresql-client

COPY db/aivaluatedb.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=aivaluate
ENV POSTGRES_DB=aivaluate

EXPOSE 5432

CMD ["postgres", "node", "server.js"]