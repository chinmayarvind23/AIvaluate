FROM node:20.14.0-buster as build

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget gnupg2 curl unzip && \
    apt-get install -y chromium

# Install Chromedriver
RUN CHROMEDRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget -N https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip -d /usr/local/bin/ && \
    rm chromedriver_linux64.zip

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install axios
RUN npm install react-datepicker
RUN npm install date-fns

RUN npm run build

RUN ls -la /app/dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/public /usr/share/nginx/html/public

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
