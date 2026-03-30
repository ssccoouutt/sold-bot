FROM node:22-bullseye

RUN apt-get update && apt-get install -y \
    git python3 make g++ build-essential \
    libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create and start a simple health check server on port 8000
RUN echo 'const http = require("http"); const server = http.createServer((req, res) => { res.writeHead(200); res.end("ok"); }); server.listen(8000, "0.0.0.0", () => { console.log("Health check server running on port 8000"); });' > health.js

# Start health server in background, then start the bot
CMD node health.js & node index.js
