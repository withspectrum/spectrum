// @flow
import puppeteer from 'puppeteer';
import data from '../../shared/testing/data';

let browser;
let page;
const channel = data.channels[0];
const community = data.communities.find(
  community => community.id === channel.communityId
);

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
  await page.goto(`http://localhost:3000/${community.slug}/${channel.slug}`);
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render', async () => {
  await page.waitForSelector('[data-e2e-id="channel-view"]');
});

it('should show the channels data', async () => {
  const content = await page.content();
  expect(content).toContain(channel.description);
  expect(content).toContain(channel.name);
});

it('should show a list of the threads in that channel', async () => {
  await page.waitForSelector('[data-e2e-id="thread-feed"]');
  const content = await page.content();
  data.threads.filter(thread => thread.channelId === channel.id).map(thread => {
    expect(content).toContain(thread.content.title);
  });
});
