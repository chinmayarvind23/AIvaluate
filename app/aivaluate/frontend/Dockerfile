FROM node:20.14.0-buster as build

WORKDIR /app

# COPY package.json package-lock.json ./
COPY package*.json ./

RUN npm install

COPY . .

RUN npm install axios

RUN npm run build

RUN npm install react-markdown remark-gfm

RUN ls -la /app/dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/public /usr/share/nginx/html/public

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
