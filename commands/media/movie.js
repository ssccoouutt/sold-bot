/**
 * Movie Downloader - DEBUG VERSION
 * Detailed logging to diagnose direct link capture issues
 */

const { chromium } = require('playwright');
const config = require('../../config');
const fs = require('fs');
const path = require('path');

// Cineverse base URL
const CINEVERSE_BASE = "https://cineverse.name.ng";

// Store browser instance (reuse across searches)
let browserInstance = null;
const DEBUG_DIR = path.join(__dirname, 'debug_screenshots');

// Create debug directory if it doesn't exist
if (!fs.existsSync(DEBUG_DIR)) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true });
}

async function getBrowser() {
    if (!browserInstance) {
        console.log('[MOVIE DEBUG] Launching browser...');
        browserInstance = await chromium.launch({
            headless: false, // Change to false for debugging
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
    }
    return browserInstance;
}

async function takeScreenshot(page, name) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.png`;
    const filepath = path.join(DEBUG_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`[MOVIE DEBUG] Screenshot saved: ${filepath}`);
    return filepath;
}

async function searchMovie(page, movieName) {
    const searchUrl = `${CINEVERSE_BASE}/search?q=${encodeURIComponent(movieName)}`;
    console.log(`[MOVIE DEBUG] Searching: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    await takeScreenshot(page, 'search_results');
    
    const results = await page.evaluate(() => {
        const results = [];
        const links = document.querySelectorAll('a');
        
        console.log(`[DEBUG] Found ${links.length} total links`);
        
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
                
                console.log(`[DEBUG] Found movie: ${title} (${year})`);
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
    
    console.log(`[MOVIE DEBUG] Found ${results.length} unique results`);
    return results;
}

async function getDownloadOptions(page, movieUrl) {
    console.log(`[MOVIE DEBUG] Navigating to movie page: ${movieUrl}`);
    await page.goto(movieUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    await takeScreenshot(page, 'movie_page');
    
    // Log page HTML structure for debugging
    const pageStructure = await page.evaluate(() => {
        return {
            hasDownloadButton: !!document.querySelector("button:has-text(\"Download\")"),
            downloadButtonsCount: document.querySelectorAll("button:has-text(\"Download\")").length,
            buttonsWithText: Array.from(document.querySelectorAll("button")).map(b => b.innerText).slice(0, 10),
            hasDialog: !!document.querySelector("[role=\"dialog\"]"),
            allRoles: Array.from(document.querySelectorAll("[role]")).map(el => el.getAttribute("role"))
        };
    });
    
    console.log('[MOVIE DEBUG] Page structure:', JSON.stringify(pageStructure, null, 2));
    
    // Click the main download button to reveal quality options
    const mainDownloadButton = await page.$("button:has-text(\"Download\")");
    if (mainDownloadButton) {
        console.log('[MOVIE DEBUG] Found main download button, clicking...');
        await mainDownloadButton.click();
        await page.waitForTimeout(5000);
        await takeScreenshot(page, 'after_download_click');
        
        // Check if dialog appeared
        const dialogExists = await page.evaluate(() => {
            return !!document.querySelector("[role=\"dialog\"]");
        });
        console.log(`[MOVIE DEBUG] Dialog exists after click: ${dialogExists}`);
    } else {
        console.log('[MOVIE DEBUG] No main download button found!');
    }
    
    const qualities = await page.evaluate(() => {
        const qualityOptions = [];
        const dialog = document.querySelector("[role=\"dialog\"]");
        
        console.log('[DEBUG] Looking for quality options in dialog...');
        
        if (dialog) {
            console.log('[DEBUG] Dialog HTML:', dialog.outerHTML.substring(0, 500));
            
            // Try multiple selectors to find quality items
            const items = dialog.querySelectorAll("div.flex.justify-between.items-center.gap-4");
            console.log(`[DEBUG] Found ${items.length} items with selector 1`);
            
            if (items.length === 0) {
                // Alternative selector
                const altItems = dialog.querySelectorAll("div[class*='flex']");
                console.log(`[DEBUG] Found ${altItems.length} items with alternative selector`);
                
                altItems.forEach((item, idx) => {
                    console.log(`[DEBUG] Item ${idx} text:`, item.innerText);
                });
            }
            
            items.forEach((item, idx) => {
                const qualityTextElem = item.querySelector("p.font-bold");
                const sizeTextElem = item.querySelector("p.text-sm.text-muted-foreground");
                const downloadButton = item.querySelector("button:has-text(\"Download\")");
                
                console.log(`[DEBUG] Item ${idx} - qualityElem: ${!!qualityTextElem}, sizeElem: ${!!sizeTextElem}, button: ${!!downloadButton}`);
                
                if (qualityTextElem && downloadButton) {
                    const qualityText = qualityTextElem.innerText;
                    const sizeText = sizeTextElem ? sizeTextElem.innerText : "Unknown";
                    
                    const qualityMatch = qualityText.match(/(\d{3,4}p)/i);
                    const sizeMatch = sizeText.match(/([\d.]+\s*(?:MB|GB))/i);
                    
                    console.log(`[DEBUG] Quality text: ${qualityText}, Size text: ${sizeText}`);
                    
                    if (qualityMatch) {
                        qualityOptions.push({
                            quality: qualityMatch[1],
                            size: sizeMatch ? sizeMatch[1] : "Unknown",
                            fullQualityText: qualityText,
                            fullSizeText: sizeText,
                            index: idx
                        });
                    }
                }
            });
        } else {
            console.log('[DEBUG] No dialog found!');
            
            // Try to find quality options outside dialog
            const possibleQualities = document.querySelectorAll("div:has(p.font-bold)");
            console.log(`[DEBUG] Found ${possibleQualities.length} possible quality containers`);
        }
        
        return qualityOptions;
    });
    
    console.log(`[MOVIE DEBUG] Found ${qualities.length} quality options:`, qualities);
    
    // Get actual button elements for each quality
    for (let i = 0; i < qualities.length; i++) {
        const quality = qualities[i];
        
        // Try multiple selector strategies
        let button = null;
        
        // Strategy 1: Direct nth-child selector
        button = await page.$(`div.flex.justify-between.items-center.gap-4:nth-child(${quality.index + 1}) button:has-text("Download")`);
        
        if (!button) {
            // Strategy 2: Find by containing text
            button = await page.$(`button:has-text("Download ${quality.quality}")`);
        }
        
        if (!button) {
            // Strategy 3: Get all download buttons and pick by index
            const allDownloadButtons = await page.$$("button:has-text(\"Download\")");
            if (allDownloadButtons.length > i) {
                button = allDownloadButtons[i];
            }
        }
        
        if (button) {
            quality.button = button;
            console.log(`[MOVIE DEBUG] Found button for quality ${quality.quality}`);
        } else {
            console.log(`[MOVIE DEBUG] Could not find button for quality ${quality.quality}`);
        }
    }
    
    return qualities;
}

async function getDirectDownloadUrl(page, qualityInfo, debugIndex) {
    console.log(`[MOVIE DEBUG] Attempting to get download link for ${qualityInfo.quality}...`);
    
    if (!qualityInfo.button) {
        console.log(`[MOVIE DEBUG] No button available for ${qualityInfo.quality}`);
        return null;
    }
    
    // Take screenshot before clicking
    await takeScreenshot(page, `before_click_${qualityInfo.quality}_${debugIndex}`);
    
    // Click the download button
    console.log(`[MOVIE DEBUG] Clicking download button for ${qualityInfo.quality}`);
    await qualityInfo.button.click();
    await page.waitForTimeout(3000);
    
    // Take screenshot after clicking
    await takeScreenshot(page, `after_click_${qualityInfo.quality}_${debugIndex}`);
    
    // Check for new tabs/pages
    const pages = await page.context().pages();
    console.log(`[MOVIE DEBUG] Total pages after click: ${pages.length}`);
    
    if (pages.length > 1) {
        const newPage = pages[pages.length - 1];
        const newPageUrl = newPage.url();
        console.log(`[MOVIE DEBUG] New page URL: ${newPageUrl}`);
        
        if (newPageUrl && newPageUrl !== 'about:blank') {
            await newPage.close();
            return newPageUrl;
        }
    }
    
    // Try to find direct download link in current page
    const downloadUrl = await page.evaluate(() => {
        // Check for all links
        const links = Array.from(document.querySelectorAll("a"));
        console.log(`[DEBUG] Found ${links.length} links`);
        
        for (const link of links) {
            const href = link.href;
            const text = link.innerText.toLowerCase();
            console.log(`[DEBUG] Link href: ${href}, text: ${text}`);
            
            if (href && (href.includes("download") || 
                        href.includes("drive.google.com") || 
                        href.includes("file.io") ||
                        href.includes("mega.nz") ||
                        href.includes("mediafire"))) {
                console.log(`[DEBUG] Found matching link: ${href}`);
                return href;
            }
        }
        
        // Check if button transformed into link
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "A" && activeElement.href) {
            console.log(`[DEBUG] Active element is link: ${activeElement.href}`);
            return activeElement.href;
        }
        
        // Check for any iframe or embedded content
        const iframes = document.querySelectorAll("iframe");
        console.log(`[DEBUG] Found ${iframes.length} iframes`);
        
        return null;
    });
    
    if (downloadUrl) {
        console.log(`[MOVIE DEBUG] Found download URL: ${downloadUrl}`);
        return downloadUrl;
    }
    
    // Check for any new elements that appeared after click
    const newElements = await page.evaluate(() => {
        const result = [];
        const downloadLinks = document.querySelectorAll("a[href*='download'], a[href*='drive'], a[href*='mega'], a[href*='mediafire']");
        downloadLinks.forEach(link => {
            result.push(link.href);
        });
        return result;
    });
    
    if (newElements.length > 0) {
        console.log(`[MOVIE DEBUG] Found new download elements:`, newElements);
        return newElements[0];
    }
    
    console.log(`[MOVIE DEBUG] No download URL found for ${qualityInfo.quality}`);
    return null;
}

module.exports = {
    name: 'movie',
    aliases: ['cinema', 'cineverse', 'movielink'],
    description: 'Search movies and get direct download links for all qualities (DEBUG VERSION)',
    usage: '.movie <movie name>',
    category: 'media',
    ownerOnly: false,

    async execute(sock, msg, args, context) {
        const { from, reply, react } = context;

        if (args.length === 0) {
            await reply(`🎬 *Movie Link Finder (DEBUG MODE)*\n\n` +
                       `Usage: \`${config.prefix}movie <movie name>\`\n\n` +
                       `*Debug features:*\n` +
                       `• Screenshots saved to debug_screenshots folder\n` +
                       `• Detailed console logging\n` +
                       `• Browser visible for debugging\n\n` +
                       `*Examples:*\n` +
                       `• \`${config.prefix}movie 3 idiots\`\n` +
                       `• \`${config.prefix}movie stranger things\``);
            return;
        }

        const query = args.join(" ");
        
        await reply(`🔍 Searching for "${query}" (DEBUG MODE - Check console for logs)...`);
        await react("🔍");
        
        let browser = null;
        let page = null;
        
        try {
            browser = await getBrowser();
            page = await browser.newPage();
            
            // Set up console log forwarding from page
            page.on('console', msg => {
                console.log(`[BROWSER CONSOLE] ${msg.text()}`);
            });
            
            const results = await searchMovie(page, query);
            
            if (!results || results.length === 0) {
                await reply(`❌ No results found for "${query}".`);
                await react('❌');
                return;
            }
            
            let searchResultsMsg = `🎬 *Search Results for "${query}":*\n\n`;
            const topResults = results.slice(0, 5);
            topResults.forEach((movie, index) => {
                searchResultsMsg += `${index + 1}. *${movie.title}* (${movie.year}) ⭐${movie.rating}\n`;
            });
            searchResultsMsg += `\nSelecting the best match: *${topResults[0].title}* (${topResults[0].year})\n`;
            await reply(searchResultsMsg);

            const selectedMovie = topResults[0];
            
            // Get all quality options
            const qualities = await getDownloadOptions(page, selectedMovie.url);
            
            if (!qualities || qualities.length === 0) {
                await reply(`❌ No download options found for *${selectedMovie.title}*\n\n` +
                           `Check debug_screenshots folder for screenshots to see what went wrong.`);
                await react('❌');
                return;
            }
            
            await reply(`📦 Found ${qualities.length} quality options. Fetching links...`);
            
            // Get download links for all qualities
            const qualityLinks = [];
            for (let i = 0; i < qualities.length; i++) {
                const quality = qualities[i];
                await reply(`🔗 Fetching ${quality.quality} link...`);
                
                const downloadUrl = await getDirectDownloadUrl(page, quality, i);
                
                qualityLinks.push({
                    quality: quality.quality,
                    size: quality.size,
                    url: downloadUrl || "❌ Failed to capture link",
                    fullText: quality.fullQualityText
                });
                
                await page.waitForTimeout(1000);
            }
            
            // Prepare final message
            let finalMessage = `✅ *${selectedMovie.title}*`;
            if (selectedMovie.year) finalMessage += ` (${selectedMovie.year})`;
            if (selectedMovie.rating) finalMessage += ` ⭐${selectedMovie.rating}`;
            finalMessage += `\n\n`;
            
            for (const link of qualityLinks) {
                if (link.url && !link.url.includes('Failed')) {
                    finalMessage += `🎬 *${link.quality}* (${link.size})\n`;
                    finalMessage += `${link.url}\n\n`;
                } else {
                    finalMessage += `❌ *${link.quality}* (${link.size}) - Link unavailable\n`;
                    finalMessage += `   Full text: ${link.fullText}\n\n`;
                }
            }
            
            finalMessage += `⚠️ *Note:* Links may expire. Download immediately.\n`;
            finalMessage += `📸 Debug screenshots saved to debug_screenshots folder`;
            
            await reply(finalMessage);
            await react('✅');
            
        } catch (error) {
            console.error('[MOVIE DEBUG] Error:', error);
            await reply(`❌ Failed: ${error.message}\n\nCheck console for full error details.`);
            await react('❌');
        } finally {
            // Don't close browser in debug mode, just the page
            if (page) {
                try {
                    await page.close();
                } catch (e) {
                    console.error('[MOVIE DEBUG] Error closing page:', e);
                }
            }
        }
    }
};
