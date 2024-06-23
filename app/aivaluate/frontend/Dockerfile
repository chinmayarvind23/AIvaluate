# Stage 1: Build the React app
FROM node:20.14.0-buster as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Build the React app
RUN npm run build

# Verify build directory contents (optional for debugging)
RUN ls -la /app/dist

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration file to conf.d
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
