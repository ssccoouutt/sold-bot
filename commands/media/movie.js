const { chromium } = require('playwright');

const CINEVERSE_BASE = "https://cineverse.name.ng";

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
    
    const mainDownloadButton = await page.$('button:has-text("Download")');
    if (mainDownloadButton) {
        await mainDownloadButton.click();
        await page.waitForTimeout(3000);
    }

    const qualities = await page.evaluate(() => {
        const qualityOptions = [];
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
            const items = dialog.querySelectorAll('div.flex.justify-between.items-center.gap-4');
            items.forEach((item, index) => {
                const qualityText = item.querySelector('p.font-bold').innerText;
                const sizeText = item.querySelector('p.text-sm.text-muted-foreground').innerText;
                const downloadButton = item.querySelector('button');

                const qualityMatch = qualityText.match(/(\d{3,4}p)/i);
                const sizeMatch = sizeText.match(/([\d.]+\s*(?:MB|GB))/i);

                if (qualityMatch && downloadButton) {
                    qualityOptions.push({
                        quality: qualityMatch[1],
                        size: sizeMatch ? sizeMatch[1] : "Unknown",
                        index: index + 1
                    });
                }
            });
        }
        return qualityOptions;
    });

    for (let i = 0; i < qualities.length; i++) {
        const quality = qualities[i];
        const buttons = await page.$$(`div.flex.justify-between.items-center.gap-4 button`);
        if (buttons.length >= quality.index) {
            quality.button = buttons[quality.index - 1];
        }
    }
    
    return qualities;
}

async function getDirectDownloadUrl(page, qualityInfo) {
    const button = qualityInfo.button;
    
    let capturedUrl = null;
    const requestHandler = (request) => {
        const url = request.url();
        if (url.includes('download') || url.includes('drive.google.com') || url.includes('file.io')) {
            capturedUrl = url;
        }
    };
    
    page.on('request', requestHandler);
    
    await button.click();
    
    let count = 0;
    while (!capturedUrl && count < 50) {
        await page.waitForTimeout(100);
        count++;
    }
    
    page.off('request', requestHandler);
    
    if (capturedUrl && !capturedUrl.endsWith('/downloads')) return capturedUrl;

    // If we are on the /downloads page, we need to find the actual link
    if (page.url().endsWith('/downloads')) {
        await page.waitForTimeout(2000);
        const actualLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            for (const link of links) {
                const href = link.href;
                if (href && (href.includes('drive.google.com') || href.includes('file.io') || href.includes('download') && !href.endsWith('/downloads'))) {
                    return href;
                }
            }
            // Look for buttons that might have the link
            const buttons = Array.from(document.querySelectorAll('button, a.btn'));
            for (const btn of buttons) {
                const text = btn.innerText.toLowerCase();
                if (text.includes('download') || text.includes('click here')) {
                    if (btn.href) return btn.href;
                    if (btn.onclick) {
                        // This is tricky, but sometimes the link is in the onclick
                        const match = btn.onclick.toString().match(/https?:\/\/[^\s'"]+/);
                        if (match) return match[0];
                    }
                }
            }
            return null;
        });
        if (actualLink) return actualLink;
    }

    const downloadUrl = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        for (const link of links) {
            const href = link.href;
            if (href && (href.includes('download') && !href.endsWith('/downloads') || href.includes('drive.google.com') || href.includes('file.io'))) {
                return href;
            }
        }
        return null;
    });

    return downloadUrl;
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('Searching for PK...');
    const results = await searchMovie(page, 'PK');
    console.log('Found results:', results.length);
    
    if (results.length > 0) {
        const selectedMovie = results[0];
        console.log('Selected:', selectedMovie.title);
        
        const qualities = await getDownloadOptions(page, selectedMovie.url);
        console.log('Qualities found:', qualities.length);
        
        for (const quality of qualities) {
            console.log(`Capturing link for ${quality.quality}...`);
            const link = await getDirectDownloadUrl(page, quality);
            console.log(`${quality.quality}: ${link || 'Failed'}`);
        }
    }
    
    await browser.close();
})();
