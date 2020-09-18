FROM node:8.12.0-alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm config set unsafe-perm true
RUN npm ci --loglevel error --ignore-scripts

COPY . .

RUN npm run validate
