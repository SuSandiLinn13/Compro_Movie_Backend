# Use official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Next.js app
# RUN npm run build

# Expose port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
