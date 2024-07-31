FROM node:20.14.0-buster

WORKDIR /app/aivaluate/backend-ai

RUN apt-get update && \
    apt-get install -y netcat-openbsd postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install
RUN npm install cheerio

COPY . .

ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

VOLUME ["/app/aivaluate/backend/assignmentSubmissions", "/app/aivaluate/backend-eval/assignmentKeys"]

EXPOSE 9000

CMD ["node", "server.js"]