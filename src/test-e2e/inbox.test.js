// @flow
import puppeteer from 'puppeteer';
import data from '../../shared/testing/data';

let browser;
let page;
const user = data.users[0];
const session = data.sessions.find(
  session =>
    session.session.passport && session.session.passport.user === user.id
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

  // Set the right cookie so that we're logged in
  await page.setCookie({
    name: 'connect.sid',
    // NOTE(@mxstbr): I logged in locally and copy and pasted this value so it works in conjunction with the ID in migrations/seed/default.js. Don't change it.
    value:
      's%3A18-Czh8IkWuq6o8LJ0OnDRXCYt7iBsQ_.7APwOHUEEQJOjmfHyGnYsSmbcaWdkBxqxLKKKosHh7E',
    domain: 'localhost',
    path: '/',
    expires: session.session.cookie._expires.getTime() / 1000,
    httpOnly: true,
    secure: false,
  });
  // Navigate the page to the inbox page for all tests
  await page.goto('http://localhost:3000/');
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render the inbox view', async () => {
  console.log(await page.content());
  await page.waitForSelector('[data-e2e-id="inbox-view"]');
});
