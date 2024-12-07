FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Add environment variable with default to dev
ENV NODE_ENV=development

# Use shell form to enable variable substitution
CMD if [ "$NODE_ENV" = "production" ] ; \
    then npm run build && npm run preview ; \
    else npm run dev ; \
    fi
