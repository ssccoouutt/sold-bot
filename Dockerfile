FROM node:22-bullseye

# Install build tools, canvas dependencies, AND Playwright dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    build-essential \
    # Canvas dependencies
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    # Playwright dependencies (Chromium, Firefox, WebKit)
    wget \
    gnupg \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    libxss1 \
    libasound2 \
    libxkbcommon0 \
    libxkbcommon-x11-0 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libdbus-1-3 \
    libexpat1 \
    libxcb1 \
    libx11-6 \
    libxcb-shm0 \
    libxcb-xfixes0 \
    libxcb-shape0 \
    libxcb-randr0 \
    libxcb-render0 \
    libxcb-sync1 \
    libxcb-keysyms1 \
    libxcb-util1 \
    libxcb-xkb1 \
    libxcb-xv0 \
    libxcb-xinerama0 \
    libxcb-glx0 \
    libxcb-present0 \
    libxcb-damage0 \
    libxshmfence1 \
    libglib2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnotify4 \
    libxtst6 \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxtst6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright and its browsers
RUN npx playwright install chromium
RUN npx playwright install-deps

# Copy application source
COPY . .

# Create a non-root user to run Playwright (recommended for security)
RUN groupadd -r pwruser && useradd -r -g pwruser -G audio,video pwruser \
    && mkdir -p /home/pwruser/.cache/ms-playwright \
    && chown -R pwruser:pwruser /home/pwruser \
    && chown -R pwruser:pwruser /app

# Switch to non-root user
USER pwruser

# Start the bot
CMD ["node", "index.js"]
