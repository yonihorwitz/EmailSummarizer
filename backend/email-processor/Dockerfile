FROM node:18-slim

WORKDIR /app/email-processor

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/index.js"] 