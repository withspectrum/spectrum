// @flow
import puppeteer from 'puppeteer';

let browser;
let page;

// If DEBUG_E2E is set show a browser and run test in slow mo
const config = process.env.DEBUG_E2E
  ? {
      headless: false,
      slowMo: 100,
    }
  : {};

// Before every test suite set up a new browser and page
beforeAll(async () => {
  browser = await puppeteer.launch(config);
  page = await browser.newPage();
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render the splash page', async () => {
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('[data-e2e-id="splash-page"]');
});
