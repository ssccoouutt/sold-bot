/**
 * Movie Downloader - Captures direct download URLs from network requests
 */

const { chromium } = require('playwright');
const config = require('../../config');

// Cineverse base URL
const CINEVERSE_BASE = "https://cineverse.name.ng";

// Store browser instance
let browserInstance = null;
let isBrowserValid = false;

async function getBrowser() {
    if (browserInstance && isBrowserValid) {
        try {
            const contexts = browserInstance.contexts();
            if (contexts && contexts.length >= 0) {
                return browserInstance;
            }
        } catch (error) {
            console.log('[MOVIE DEBUG] Browser invalid, creating new one');
            browserInstance = null;
            isBrowserValid = false;
        }
    }
    
    try {
        console.log('[MOVIE DEBUG] Launching new browser instance...');
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
        
        browserInstance.on('disconnected', () => {
            console.log('[MOVIE DEBUG] Browser disconnected');
            isBrowserValid = false;
            browserInstance = null;
        });
        
        isBrowserValid = true;
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
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
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
    
    try {
        await page.goto(movieUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);
        
        // Click Download button
        const downloadBtn = await page.waitForSelector('button:has-text("Download")', { timeout: 10000 }).catch(() => null);
        if (downloadBtn) {
            await downloadBtn.click();
            console.log('[MOVIE DEBUG] Clicked Download button');
            await page.waitForTimeout(2000);
        }
        
        // Click Video tab
        const videoTab = await page.waitForSelector('button:has-text("Video")', { timeout: 10000 }).catch(() => null);
        if (videoTab) {
            await videoTab.click();
            console.log('[MOVIE DEBUG] Clicked Video tab');
            await page.waitForTimeout(1000);
        }
        
        // Find all download buttons (quality selectors)
        const qualityButtons = await page.$$('button');
        const qualities = [];
        
        for (const btn of qualityButtons) {
            const btnText = await btn.innerText();
            // Look for buttons with quality indicators
            if (btnText.match(/\d{3,4}p/i) || (btnText.toLowerCase().includes('download') && btnText.match(/\d{3,4}p/i))) {
                const qualityMatch = btnText.match(/(\d{3,4}p)/i);
                const sizeMatch = btnText.match(/([\d.]+\s*(?:MB|GB))/i);
                
                if (qualityMatch) {
                    qualities.push({
                        quality: qualityMatch[1],
                        size: sizeMatch ? sizeMatch[1] : "Unknown",
                        button: btn
                    });
                    console.log('[MOVIE DEBUG] Found quality button:', qualityMatch[1], sizeMatch ? sizeMatch[1] : 'Unknown');
                }
            }
        }
        
        // If no quality buttons found with the above method, try alternative selector
        if (qualities.length === 0) {
            const downloadButtons = await page.$$('button:has-text("Download")');
            for (const btn of downloadButtons) {
                const parent = await btn.evaluateHandle(el => {
                    let curr = el;
                    while (curr && curr.parentElement) {
                        const text = curr.innerText;
                        if (text.match(/\d{3,4}p/i)) {
                            return curr;
                        }
                        curr = curr.parentElement;
                    }
                    return el;
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
                    console.log('[MOVIE DEBUG] Found quality (alternative):', qualityMatch[1]);
                }
            }
        }
        
        return qualities;
    } catch (error) {
        console.error('[MOVIE DEBUG] Error in getDownloadOptions:', error);
        return [];
    }
}

async function getDirectDownloadUrl(page, qualityInfo) {
    const button = qualityInfo.button;
    let capturedUrl = null;
    
    return new Promise(async (resolve) => {
        // Set timeout for this operation
        const timeoutId = setTimeout(() => {
            console.log('[MOVIE DEBUG] Timeout waiting for download URL');
            resolve(null);
        }, 15000);
        
        // Listen for download events (Playwright's built-in download handling)
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
        
        // Also listen for network requests that might be download URLs
        const requestHandler = (request) => {
            const url = request.url();
            // Check for various download patterns
            if (url && (
                url.includes('.mp4') ||
                url.includes('.mkv') ||
                url.includes('download') ||
                url.includes('googlevideo') ||
                url.includes('videoplayback') ||
                (url.includes('drive') && url.includes('uc')) ||
                url.match(/\/[a-zA-Z0-9]+\.[mp4|mkv|avi]/i)
            )) {
                capturedUrl = url;
                console.log('[MOVIE DEBUG] Captured download URL from request');
                clearTimeout(timeoutId);
                resolve(capturedUrl);
            }
        };
        
        page.on('request', requestHandler);
        
        // Also listen for responses (some downloads might be in response headers)
        const responseHandler = (response) => {
            const url = response.url();
            const headers = response.headers();
            
            if (headers['content-disposition'] && headers['content-disposition'].includes('attachment')) {
                capturedUrl = url;
                console.log('[MOVIE DEBUG] Captured download URL from response');
                clearTimeout(timeoutId);
                resolve(capturedUrl);
            }
        };
        
        page.on('response', responseHandler);
        
        try {
            console.log('[MOVIE DEBUG] Clicking quality button:', qualityInfo.quality);
            await button.click();
            
            // Check if Playwright captured a download event
            const download = await downloadPromise;
            if (download) {
                const downloadUrl = download.url();
                console.log('[MOVIE DEBUG] Captured download URL from download event');
                capturedUrl = downloadUrl;
                clearTimeout(timeoutId);
                // Cancel the download to save resources
                await download.cancel().catch(() => {});
                resolve(capturedUrl);
            }
        } catch (error) {
            console.error('[MOVIE DEBUG] Error clicking button:', error);
        }
        
        // Clean up event listeners after delay
        setTimeout(() => {
            page.off('request', requestHandler);
            page.off('response', responseHandler);
            clearTimeout(timeoutId);
            if (!capturedUrl) {
                resolve(null);
            }
        }, 12000);
    });
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
        let browser = null;
        
        try {
            browser = await getBrowser();
            page = await browser.newPage();
            
            // Set user agent
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
            
            await reply(`🎬 *${selectedMovie.title}*\n⏳ Fetching download links...`);
            
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
                
                await page.waitForTimeout(1000);
            }
            
            let finalMessage = `✅ *${selectedMovie.title}*`;
            if (selectedMovie.year) finalMessage += ` (${selectedMovie.year})`;
            if (selectedMovie.rating) finalMessage += ` ⭐${selectedMovie.rating}`;
            finalMessage += `\n\n📥 *Download Links:*\n\n`;
            
            let hasValidLinks = false;
            for (const link of qualityLinks) {
                if (link.url && !link.url.includes('Failed')) {
                    finalMessage += `🎬 *${link.quality}* (${link.size})\n`;
                    finalMessage += `${link.url}\n\n`;
                    hasValidLinks = true;
                } else {
                    finalMessage += `❌ *${link.quality}* (${link.size}) - Link unavailable\n\n`;
                }
            }
            
            if (!hasValidLinks) {
                finalMessage = `❌ Failed to capture any valid download links for *${selectedMovie.title}*.\n\nThis could be due to:\n• Anti-bot protection\n• Website structure change\n• Network issues\n\nTry again later or use a different movie.`;
            } else {
                finalMessage += `⚠️ *Note:* Links may expire. Download immediately.\n💡 Use a download manager for better speed.`;
            }
            
            await reply(finalMessage);
            await react(hasValidLinks ? '✅' : '❌');
            
        } catch (error) {
            console.error('[MOVIE DEBUG] Error:', error);
            await reply(`❌ Failed: ${error.message}`);
            await react('❌');
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (e) {}
            }
        }
    }
};
