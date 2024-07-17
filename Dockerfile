# build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


ENV MYSQL_PASSWORD=rootroot \
    MYSQL_HOST='ezcryptoexchange.creye0kuc4ct.ap-northeast-2.rds.amazonaws.com'

RUN npm run build

# prod stage
FROM node:18-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./


RUN npm install --only=production
RUN rm package*.json



EXPOSE 3001

CMD [ "node", "dist/main.js" ]