// @flow
import puppeteer from 'puppeteer';
import data from '../../shared/testing/data';

let browser;
let page;
const community = data.communities[0];

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
  await page.goto(`http://localhost:3000/${community.slug}`);
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render', async () => {
  await page.waitForSelector('[data-e2e-id="community-view"]');
});

it('should show the communities data', async () => {
  const content = await page.content();
  expect(content).toContain(community.description);
  expect(content).toContain(community.name);
  expect(content).toContain(community.website);
  expect(content).toContain(community.profilePhoto);
  expect(content).toContain(community.coverPhoto);
});

it('should show a list of the threads in that community', async () => {
  await page.waitForSelector('[data-e2e-id="thread-feed"]');
  const content = await page.content();
  data.threads
    .filter(thread => thread.communityId === community.id)
    .map(thread => {
      expect(content).toContain(thread.content.title);
    });
});

it('should show a list of channels in that community', async () => {
  const content = await page.content();
  data.channels
    .filter(channel => channel.communityId === community.id)
    .map(channel => {
      expect(content).toContain(channel.name);
    });
});
