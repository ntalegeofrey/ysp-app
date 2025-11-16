# ---------------------------------------------------------
# STAGE 1: Build the Next.js app
# ---------------------------------------------------------
FROM node:20-alpine AS builder

# Create working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Accept API base as build-time argument and expose to Next.js
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build

# ---------------------------------------------------------
# STAGE 2: Run the app in production mode
# ---------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
