# Dockerfile (in root folder)
FROM node:18-alpine

WORKDIR /app

# Copy only backend files
COPY backend/package*.json ./

RUN npm install --production

# Copy server and frontend files
COPY backend/ . 

EXPOSE 3000

CMD ["node", "server.js"]
