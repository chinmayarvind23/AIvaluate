FROM node:20.14.0-buster as build

WORKDIR /src

COPY package.json .

RUN npm ci --production

COPY . .

RUN npm run build

# setting up production using nginx web server
FROM nginx:1.12-apline as prod 

COPY --from=build /src/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]