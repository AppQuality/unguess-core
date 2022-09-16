FROM node:18.9.0-alpine3.15 as base

COPY package*.json ./

RUN npm r better-sqlite3
RUN npm install

COPY . .

RUN npm i -g npm-run-all 
RUN npm run build

FROM alpine:3.14 as web

COPY --from=base /dist /app/build
COPY package*.json /app/
COPY --from=base /src/routes /app/src/routes
COPY --from=base /.git/HEAD /app/.git/HEAD
COPY --from=base /.git/refs /app/.git/refs
WORKDIR /app
RUN apk add nodejs npm openssl
RUN npm install --only=prod
CMD node build/index.js