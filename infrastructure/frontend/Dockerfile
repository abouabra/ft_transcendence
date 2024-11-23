FROM node:22-alpine

COPY package.json /tmp/package.json

WORKDIR /app

EXPOSE 3000

CMD ["sh", "-c", "npm install && exec node server.js"]