FROM node:lts-alpine

LABEL org.opencontainers.image.source https://github.com/whospaul/paradise-api

WORKDIR /srv

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]