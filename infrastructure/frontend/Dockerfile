FROM node:22-alpine

WORKDIR /tmp

COPY package.json .

RUN npm install

WORKDIR /app

EXPOSE 3000

ENTRYPOINT ["node"]
CMD [ "server.js" ]