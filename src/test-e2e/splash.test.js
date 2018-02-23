// @flow
import puppeteer from 'puppeteer';
import { config } from './utils';

let browser;
let page;

// Before every test suite set up a new browser and page
beforeAll(async () => {
  browser = await puppeteer.launch(config);
  page = await browser.newPage();
  // Navigate the page to the splash page for all tests
  await page.goto('http://localhost:3000/');
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render the splash page', async () => {
  await page.waitForSelector('[data-e2e-id="splash-page"]');
});

it('should have a login button', async () => {
  await page.waitForSelector('[href*="/login"]');
});

it('should have a button to explore', async () => {
  await page.waitForSelector('[href*="/explore"]');
});

it('should have a button to /new/community', async () => {
  await page.waitForSelector('[href*="/new/community"]');
});
