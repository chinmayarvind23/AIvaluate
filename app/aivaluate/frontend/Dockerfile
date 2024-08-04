FROM node:20.14.0-buster as build

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
    RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
    RUN apt-get -y update
    RUN apt-get install -y google-chrome-stable
    
    # Install ChromeDriver
    RUN CHROME_DRIVER_VERSION=`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE` && \
        wget -N http://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip -P ~/ && \
        unzip ~/chromedriver_linux64.zip -d ~/ && \
        rm ~/chromedriver_linux64.zip && \
        mv -f ~/chromedriver /usr/local/bin/chromedriver && \
        chown root:root /usr/local/bin/chromedriver && \
        chmod 0755 /usr/local/bin/chromedriver

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install axios

RUN npm install react-datepicker
RUN npm install date-fns
RUN npm install selenium-webdriver

RUN npm run build

RUN ls -la /app/dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/public /usr/share/nginx/html/public

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
