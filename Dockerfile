# Step 1: Use Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# --- FIX FOR GOOGLE CLOUD ---
# Install a simple server to host the site
RUN npm install -g serve

# Force the app to listen on Port 8080
ENV PORT=8080
EXPOSE 8080

# Start command
CMD ["serve", "-s", "dist", "-l", "8080"]
