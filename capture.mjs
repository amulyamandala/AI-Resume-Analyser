import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = 'https://ai-resume-analyser-jade.vercel.app';
const dir = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Capturing Home...');
        await page.goto(`${url}/`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'home.png') });
        
        console.log('Capturing Login...');
        await page.goto(`${url}/login`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'login.png') });
        
        console.log('Capturing Register...');
        await page.goto(`${url}/register`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'register.png') });

        // Let's try dashboard. It might redirect to login if protected.
        console.log('Capturing Dashboard...');
        await page.goto(`${url}/dashboard`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'dashboard.png') });

        console.log('Capturing Study Plan...');
        await page.goto(`${url}/studyplan`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'studyplan.png') });

        console.log('Capturing Profile...');
        await page.goto(`${url}/profile`, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'profile.png') });

        console.log('Done capturing screenshots.');
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
