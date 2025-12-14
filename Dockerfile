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

# --- FIX FOR CLOUD RUN ---
# Force the app to use Port 8080 and listen on all addresses
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

# Start command
CMD ["npm", "start"]
