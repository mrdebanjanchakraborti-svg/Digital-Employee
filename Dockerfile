FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# --- FIX FOR CLOUD RUN PORT 8080 ERROR ---
ENV PORT=8080
EXPOSE 8080

# Install a simple server to serve the static build on Port 8080
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "8080"]
