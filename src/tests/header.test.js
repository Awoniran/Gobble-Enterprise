const puppeteer = require('puppeteer');
test('launch chromium browser', async () => {
   const browser = await puppeteer.launch({
      headless: false,
   });
   const page = await browser.newPage();
   await page.goto('localhost:8000');
});
