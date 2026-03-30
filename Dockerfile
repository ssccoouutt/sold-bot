FROM node:22-bullseye

# Install all system dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    build-essential \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    libvips-dev \
    ffmpeg \
    curl \
    wget \
    fonts-dejavu \
    fonts-freefont-ttf \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Create health check server
RUN echo 'const http = require("http"); const server = http.createServer((req, res) => { res.writeHead(200); res.end("ok"); }); server.listen(8000, "0.0.0.0", () => { console.log("✅ Health check server running on port 8000"); });' > health.js

# Start health server in background, then start the bot
CMD node health.js & node index.js
