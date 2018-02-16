// @flow
import { communityCreated } from '../changefeeds/community';
import db from 'shared/testing/db';
import processCommunityCreated from '../queues/processCommunityCreated';
import createQueue from 'shared/bull/create-queue';
import { stripe } from 'shared/stripe';

const queue = createQueue('process stripe community created');

jest.mock('shared/stripe', () => ({
  stripe: {
    customers: {
      create: jest.fn(() => ({ id: 'asdf' })),
    },
  },
}));

const testId = '12345';
const testCommunity = {
  id: testId,
  name: 'Test community',
  administratorEmail: 'briandlovin@gmail.com',
};

const createTestCommunity = async () =>
  await db.table('communities').insert(testCommunity);
const deleteTestCommunity = async () =>
  await db.table('communities').delete(testId);

let cursor;
beforeAll(() => {
  queue.process(processCommunityCreated);
  return communityCreated().then(c => {
    cursor = c;
  });
});

afterAll(() => {
  return Promise.all([cursor.close(), queue.close()]);
});

afterEach(() => {
  return deleteTestCommunity();
});

it('should do whatever', async () => {
  await createTestCommunity();
  // TODO(@mxstbr): Figure out how to not have to do this
  await new Promise(res => setTimeout(res, 1000));

  const community = await db
    .table('communities')
    .get(testId)
    .run();
  expect(community).toBeDefined();
  expect(stripe.customers.create).toHaveBeenCalled();
  expect(community.stripeCustomerId).toEqual('asdf');
});
