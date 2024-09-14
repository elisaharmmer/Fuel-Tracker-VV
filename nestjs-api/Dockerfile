# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
