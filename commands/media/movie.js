/**
 * Movie Downloader - Using Playwright (Fixed)
 */

const { chromium } = require('playwright');
const config = require('../../config');

// Cineverse base URL
const CINEVERSE_BASE = "https://cineverse.name.ng";

// Store browser instance
let browserInstance = null;

async function getBrowser() {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }
    
    try {
        console.log('[MOVIE DEBUG] Launching browser in headless mode...');
        browserInstance = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-accelerated-2d-canvas',
                '--disable-accelerated-jpeg-decoding',
                '--no-zygote',
                '--single-process',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });
        console.log('[MOVIE DEBUG] Browser launched successfully');
        return browserInstance;
    } catch (error) {
        console.error('[MOVIE DEBUG] Failed to launch browser:', error);
        throw new Error(`Browser launch failed: ${error.message}`);
    }
}

async function searchMovie(page, movieName) {
    const searchUrl = `${CINEVERSE_BASE}/search?q=${encodeURIComponent(movieName)}`;
    console.log('[MOVIE DEBUG] Searching:', searchUrl);
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
        const results = [];
        const links = document.querySelectorAll('a');
        for (let link of links) {
            const text = link.innerText.trim();
            const href = link.href;
            if (text && text.length > 3 && href && (href.includes('/movie/') || href.includes('/tv/'))) {
                const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                let year = '', rating = '', title = '';
                
                for (let line of lines) {
                    if (line.match(/^\d{4}$/)) year = line;
                    else if (line.match(/^\d\.\d$/)) rating = line;
                    else if (line.toLowerCase() !== 'movie' && line.length > title.length) {
                        title = line;
                    }
                }
                
                if (!title) title = lines[lines.length - 1] || text;

                results.push({
                    title: title,
                    year: year,
                    rating: rating,
                    url: href
                });
            }
        }
        const unique = [];
        const seen = new Set();
        for (let r of results) {
            if (!seen.has(r.url)) {
                seen.add(r.url);
                unique.push(r);
            }
        }
        return unique;
    });
    
    console.log('[MOVIE DEBUG] Found', results.length, 'results');
    return results;
}

async function getDownloadOptions(page, movieUrl) {
    console.log('[MOVIE DEBUG] Getting download options for:', movieUrl);
    await page.goto(movieUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Click Download button
    const buttons = await page.$$('button');
    for (const btn of buttons) {
        const text = await btn.innerText();
        if (text && text.includes('Download')) {
            await btn.click();
            console.log('[MOVIE DEBUG] Clicked Download button');
            break;
        }
    }
    
    await page.waitForTimeout(3000);
    
    // Click Video tab
    const videoTab = await page.$('button:has-text("Video")');
    if (videoTab) {
        await videoTab.click();
        console.log('[MOVIE DEBUG] Clicked Video tab');
        await page.waitForTimeout(1000);
    }
    
    const downloadButtons = await page.$$('button:has-text("Download")');
    console.log('[MOVIE DEBUG] Found', downloadButtons.length, 'download buttons');
    
    const qualities = [];
    for (const btn of downloadButtons) {
        const parent = await btn.evaluateHandle(el => {
            let curr = el;
            while (curr && curr.parentElement && !curr.innerText.includes('p')) {
                curr = curr.parentElement;
            }
            return curr;
        });
        
        const parentText = await parent.innerText();
        const qualityMatch = parentText.match(/(\d{3,4}p)/i);
        const sizeMatch = parentText.match(/([\d.]+\s*(?:MB|GB))/i);
        
        if (qualityMatch) {
            qualities.push({
                quality: qualityMatch[1],
                size: sizeMatch ? sizeMatch[1] : "Unknown",
                button: btn
            });
            console.log('[MOVIE DEBUG] Found quality:', qualityMatch[1], sizeMatch ? sizeMatch[1] : 'Unknown');
        }
    }
    
    return qualities;
}

async function getDirectDownloadUrl(page, qualityInfo) {
    const button = qualityInfo.button;
    
    let capturedUrl = null;
    const requestHandler = (request) => {
        const url = request.url();
        if (url.includes('download') && (url.includes('id=') || url.includes('url='))) {
            capturedUrl = url;
            console.log('[MOVIE DEBUG] Captured download URL:', url.substring(0, 100));
        }
    };
    
    page.on('request', requestHandler);
    
    await button.click();
    console.log('[MOVIE DEBUG] Clicked quality button:', qualityInfo.quality);
    
    // Wait for the request to be captured
    let count = 0;
    while (!capturedUrl && count < 50) {
        await page.waitForTimeout(100);
        count++;
    }
    
    page.off('request', requestHandler);
    
    if (!capturedUrl) {
        console.log('[MOVIE DEBUG] Failed to capture download URL');
    }
    
    return capturedUrl;
}

module.exports = {
    name: 'movie',
    aliases: ['cinema', 'cineverse', 'movielink'],
    description: 'Search movies and get direct download links for all qualities',
    usage: '.movie <movie name>',
    category: 'media',
    ownerOnly: false,

    async execute(sock, msg, args, context) {
        const { from, reply, react } = context;

        if (args.length === 0) {
            await reply(`🎬 *Movie Link Finder*\n\n` +
                       `Usage: \`${config.prefix}movie <movie name>\`\n\n` +
                       `*Examples:*\n` +
                       `• \`${config.prefix}movie 3 idiots\`\n` +
                       `• \`${config.prefix}movie stranger things\``);
            return;
        }

        const query = args.join(' ');
        
        await react('🔍');
        
        let page = null;
        
        try {
            const browser = await getBrowser();
            page = await browser.newPage();
            
            // Set user agent for Playwright (different from puppeteer)
            await page.setExtraHTTPHeaders({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });
            
            const results = await searchMovie(page, query);
            
            if (!results || results.length === 0) {
                await reply(`❌ No results found for "${query}".`);
                await react('❌');
                return;
            }
            
            const selectedMovie = results[0];
            
            const qualities = await getDownloadOptions(page, selectedMovie.url);
            
            if (!qualities || qualities.length === 0) {
                await reply(`❌ No download options found for *${selectedMovie.title}*`);
                await react('❌');
                return;
            }
            
            const qualityLinks = [];
            for (let i = 0; i < qualities.length; i++) {
                const quality = qualities[i];
                const downloadUrl = await getDirectDownloadUrl(page, quality);
                
                qualityLinks.push({
                    quality: quality.quality,
                    size: quality.size,
                    url: downloadUrl || "❌ Failed to capture link"
                });
                
                await page.waitForTimeout(500);
            }
            
            let finalMessage = `✅ *${selectedMovie.title}*`;
            if (selectedMovie.year) finalMessage += ` (${selectedMovie.year})`;
            if (selectedMovie.rating) finalMessage += ` ⭐${selectedMovie.rating}`;
            finalMessage += `\n\n`;
            
            for (const link of qualityLinks) {
                if (link.url && !link.url.includes('Failed')) {
                    finalMessage += `🎬 *${link.quality}* (${link.size})\n`;
                    finalMessage += `${link.url}\n\n`;
                } else {
                    finalMessage += `❌ *${link.quality}* (${link.size}) - Link unavailable\n\n`;
                }
            }
            
            finalMessage += `⚠️ *Note:* Links may expire. Download immediately.`;
            
            await reply(finalMessage);
            await react('✅');
            
        } catch (error) {
            console.error('[MOVIE DEBUG] Error:', error);
            await reply(`❌ Failed: ${error.message}`);
            await react('❌');
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (e) {
                    console.error('[MOVIE DEBUG] Error closing page:', e.message);
                }
            }
        }
    }
};
