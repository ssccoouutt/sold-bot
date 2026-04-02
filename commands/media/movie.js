/**
 * Movie Downloader - Fixed browser stability
 */

const { chromium } = require('playwright');
const config = require('../../config');

// Cineverse base URL
const CINEVERSE_BASE = "https://cineverse.name.ng";

// Single browser instance - reuse always
let browserInstance = null;
let browserInitPromise = null;

async function getBrowser() {
    // If browser exists and is connected, return it
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }
    
    // If we're already initializing, wait for that
    if (browserInitPromise) {
        return browserInitPromise;
    }
    
    // Initialize new browser
    browserInitPromise = (async () => {
        try {
            console.log('[MOVIE] Launching browser...');
            browserInstance = await chromium.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });
            console.log('[MOVIE] Browser launched successfully');
            browserInitPromise = null;
            return browserInstance;
        } catch (error) {
            console.error('[MOVIE] Failed to launch browser:', error);
            browserInitPromise = null;
            throw error;
        }
    })();
    
    return browserInitPromise;
}

async function searchMovie(page, movieName) {
    const searchUrl = `${CINEVERSE_BASE}/search?q=${encodeURIComponent(movieName)}`;
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
    
    return results;
}

async function getDownloadOptions(page, movieUrl) {
    await page.goto(movieUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const downloadBtn = await page.$('button:has-text("Download")');
    if (downloadBtn) {
        await downloadBtn.click();
        await page.waitForTimeout(2000);
    }
    
    const videoTab = await page.$('button:has-text("Video")');
    if (videoTab) {
        await videoTab.click();
        await page.waitForTimeout(1000);
    }
    
    const downloadButtons = await page.$$('button:has-text("Download")');
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
        }
    }
    
    return qualities;
}

async function getDirectDownloadUrl(page, qualityInfo) {
    const button = qualityInfo.button;
    let capturedUrl = null;
    
    return new Promise(async (resolve) => {
        const timeoutId = setTimeout(() => {
            resolve(null);
        }, 10000);
        
        const requestHandler = (request) => {
            const url = request.url();
            // Filter out image URLs
            if (url && !url.includes('pbcdnw.aoneroom.com') && !url.includes('/image/')) {
                capturedUrl = url;
                clearTimeout(timeoutId);
                resolve(capturedUrl);
            }
        };
        
        page.on('request', requestHandler);
        
        try {
            await button.click();
        } catch (error) {
            console.error('[MOVIE] Error clicking button:', error.message);
        }
        
        setTimeout(() => {
            page.off('request', requestHandler);
            clearTimeout(timeoutId);
            if (!capturedUrl) resolve(null);
        }, 8000);
    });
}

module.exports = {
    name: 'movie',
    aliases: ['cinema', 'cineverse', 'movielink'],
    description: 'Search movies and get direct download links',
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
                       `• \`${config.prefix}movie pk\``);
            return;
        }

        const query = args.join(' ');
        
        await react('🔍');
        
        let page = null;
        
        try {
            const browser = await getBrowser();
            page = await browser.newPage();
            
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
                    url: downloadUrl || "❌ Failed"
                });
                
                await page.waitForTimeout(500);
            }
            
            let finalMessage = `✅ *${selectedMovie.title}*`;
            if (selectedMovie.year) finalMessage += ` (${selectedMovie.year})`;
            if (selectedMovie.rating) finalMessage += ` ⭐${selectedMovie.rating}`;
            finalMessage += `\n\n📥 *Download Links:*\n\n`;
            
            let hasValidLinks = false;
            for (const link of qualityLinks) {
                if (link.url && !link.url.includes('Failed') && !link.url.includes('pbcdnw')) {
                    finalMessage += `🎬 *${link.quality}* (${link.size})\n`;
                    finalMessage += `${link.url}\n\n`;
                    hasValidLinks = true;
                }
            }
            
            if (!hasValidLinks) {
                finalMessage = `❌ Failed to capture any valid download links.`;
            } else {
                finalMessage += `⚠️ *Note:* Links may expire. Download immediately.`;
            }
            
            await reply(finalMessage);
            await react(hasValidLinks ? '✅' : '❌');
            
        } catch (error) {
            console.error('[MOVIE] Error:', error);
            await reply(`❌ Failed: ${error.message}`);
            await react('❌');
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (e) {
                    console.error('[MOVIE] Error closing page:', e.message);
                }
            }
            // IMPORTANT: Don't close browser here - keep it for next command
        }
    }
};
