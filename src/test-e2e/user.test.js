// @flow
import puppeteer from 'puppeteer';
import data from '../../shared/testing/data';

let browser;
let page;
const user = data.users[0];

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
  await page.goto(`http://localhost:3000/users/${user.username}`);
});

// Afterwards close the browser
afterAll(async () => {
  await browser.close();
});

it('should render', async () => {
  await page.waitForSelector('[data-e2e-id="user-view"]');
});

it('should show the users data', async () => {
  const content = await page.content();
  expect(content).toContain(user.username);
  expect(content).toContain(user.name);
  expect(content).toContain(user.description);
  expect(content).toContain(user.website);
});

it('should list threads the users has posted', async () => {
  await page.waitForSelector('[data-e2e-id="thread-feed"]');
  const content = await page.content();
  data.threads.filter(thread => thread.creatorId === user.id).map(thread => {
    expect(content).toContain(thread.content.title);
  });
});

it('should list the communities a user is a member of, including their rep in that community', async () => {
  const content = await page.content();
  const usersCommunities = data.usersCommunities.filter(
    ({ userId }) => userId === user.id
  );
  const communityIds = usersCommunities.map(({ communityId }) => communityId);
  const communities = data.communities.filter(({ id }) =>
    communityIds.includes(id)
  );
  communities.map(community => {
    expect(content).toContain(community.name);
    const userCommunity = usersCommunities.find(
      ({ communityId }) => communityId === community.id
    );
    expect(content).toContain(userCommunity.reputation);
  });
});
