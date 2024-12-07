FROM node:18-slim

WORKDIR /app/web-server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
