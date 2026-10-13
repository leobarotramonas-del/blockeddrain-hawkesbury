import { chromium } from 'playwright-core';
import path from 'node:path';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});

for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(process.env.CAPTURE_URL ?? 'http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 800));
  });
  await page.screenshot({ path: path.resolve(`.impeccable/review/${name}.png`), fullPage: true });
  await page.close();
}

await browser.close();
