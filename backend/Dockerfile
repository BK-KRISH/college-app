# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
# copy package.json first to leverage cache
COPY package*.json ./
RUN npm install --production

# copy the rest (server + public)
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
