FROM node:15.12.0-alpine3.10

RUN apk upgrade -U -a && apk add \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont
     
WORKDIR /root

COPY ./src /root/src
COPY ./main.js /root
COPY package.json /root

RUN npm install

CMD ["node", "/root/main.js"]
