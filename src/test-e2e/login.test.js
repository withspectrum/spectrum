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
  // Navigate the page to the login page for all tests
  await page.goto('http://localhost:3000/login');
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render the login page', async () => {
  await page.waitForSelector('[data-e2e-id="login-page"]');
});

it('should have a link to twitter auth', async () => {
  await page.waitForSelector('[href*="/auth/twitter"]');
});

it('should have a link to facebook auth', async () => {
  await page.waitForSelector('[href*="/auth/facebook"]');
});

it('should have a link to google auth', async () => {
  await page.waitForSelector('[href*="/auth/google"]');
});

it('should have a link to the code of conduct', async () => {
  await page.waitForSelector(
    '[href*="github.com/withspectrum/code-of-conduct"]'
  );
});
