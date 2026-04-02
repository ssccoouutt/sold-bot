const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 Setting up Playwright for your environment...');

// Detect if running in Google Colab
const isColab = fs.existsSync('/content') || process.env.COLAB_RELEASE;

if (isColab) {
    console.log('📱 Detected Google Colab environment');
    console.log('📦 Installing system dependencies for Playwright...');
    
    try {
        // Install system dependencies for Colab
        execSync('apt-get update', { stdio: 'inherit' });
        execSync('apt-get install -y ' + [
            'libatk-bridge2.0-0',
            'libatk1.0-0',
            'libcups2',
            'libdrm2',
            'libgbm1',
            'libgtk-3-0',
            'libnspr4',
            'libnss3',
            'libx11-xcb1',
            'libxcb-dri3-0',
            'libxcomposite1',
            'libxdamage1',
            'libxfixes3',
            'libxrandr2',
            'libxshmfence1',
            'libxss1',
            'libasound2',
            'libxkbcommon0',
            'libxkbcommon-x11-0',
            'libgl1-mesa-glx',
            'libglib2.0-0',
            'libdbus-1-3',
            'libexpat1',
            'libxcb1',
            'libx11-6',
            'libxcb-shm0',
            'libxcb-xfixes0',
            'libxcb-shape0',
            'libxcb-randr0',
            'libxcb-render0',
            'libxcb-sync1',
            'libxcb-keysyms1',
            'libxcb-util1',
            'libxcb-xkb1',
            'libxcb-xv0',
            'libxcb-xinerama0',
            'libxcb-glx0',
            'libxcb-present0',
            'libxcb-damage0',
            'libgdk-pixbuf2.0-0',
            'libnotify4',
            'libxtst6',
            'libxi6',
            'libxcursor1',
            'libxrender1'
        ].join(' '), { stdio: 'inherit' });
        
        console.log('✅ System dependencies installed successfully');
    } catch (error) {
        console.log('⚠️ Could not install system dependencies automatically');
        console.log('Please run this command manually in Colab:');
        console.log('!apt-get update && apt-get install -y libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxcb-dri3-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxshmfence1 libxss1');
    }
}

// Install Playwright browsers
console.log('📦 Installing Playwright browsers...');
try {
    execSync('npx playwright install chromium', { stdio: 'inherit' });
    console.log('✅ Playwright browsers installed successfully');
} catch (error) {
    console.error('❌ Failed to install Playwright browsers:', error.message);
    process.exit(1);
}

console.log('✨ Playwright setup complete!');
