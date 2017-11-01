// @flow
import puppeteer from 'puppeteer';
import { toPlainText, toState } from '../../shared/draft-utils';
import data from '../../shared/testing/data';

let browser;
let page;
const thread = data.threads[0];
const channel = data.channels.find(channel => channel.id === thread.channelId);
const community = data.communities.find(
  community => community.id === thread.communityId
);
const author = data.users.find(user => user.id === thread.creatorId);
const messages = data.messages.filter(
  message => message.threadId === thread.id
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
  await page.goto(`http://localhost:3000/thread/${thread.id}`);
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render', async () => {
  await page.waitForSelector('[data-e2e-id="thread-view"]');
});

it('should show the threads content', async () => {
  const content = await page.content();
  expect(content).toContain(thread.content.title);
  expect(content).toContain(
    toPlainText(toState(JSON.parse(thread.content.body))).split(' ')[0]
  );
});

it('should show the threads author', async () => {
  const content = await page.content();
  expect(content).toContain(author.name);
  expect(content).toContain(author.username);
});

it('should have a link to the author', async () => {
  await page.waitForSelector(`[href*="/users/${author.username}"]`);
});

it('should have a link to the community', async () => {
  await page.waitForSelector(`[href*="/${community.slug}"]`);
});

it('should have a link to the channel', async () => {
  await page.waitForSelector(`[href*="/${community.slug}/${channel.slug}"]`);
});

it('should show all its messages', async () => {
  await page.waitForSelector('[data-e2e-id="message-group"]');
  const content = await page.content();
  messages.forEach(message => {
    expect(content).toContain(
      toPlainText(toState(JSON.parse(message.content.body)))
    );
  });
});
