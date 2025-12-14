# Step 1: Use Node.js to build the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Expose port 8080 (standard for Cloud Run)
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
