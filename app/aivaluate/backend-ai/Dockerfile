FROM node:20.14.0-buster

WORKDIR /app/aivaluate/backend-ai

RUN apt-get update && \
    apt-get install -y \
        netcat-openbsd \
        postgresql-client \
        wget \
        gnupg2 \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdbus-1-3 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        libgbm-dev \
        libgtk-3-0 \
        libasound2 \
        libpangocairo-1.0-0 \
        libxrandr2 \
        xdg-utils \
        libjpeg62-turbo \
        libenchant1c2a \
        libicu63 \
        libvpx5 \
        libevent-2.1-6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install && npm install cheerio && npm install playwright

RUN npx playwright install

COPY . .

ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

VOLUME ["/app/aivaluate/backend/assignmentSubmissions", "/app/aivaluate/backend-eval/assignmentKeys"]

EXPOSE 9000

CMD ["node", "server.js"]