# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the backend's package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the backend code
COPY backend/ .

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
