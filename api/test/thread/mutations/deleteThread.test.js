//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

const defaultThread = data.threads[0];
const owner = data.users.find(({ username }) => username === 'mxstbr');
const member = data.users.find(({ username }) => username === 'brian');
const noPermissionUser = data.users.find(
  ({ username }) => username === 'bad-boy'
);

// before each test, makre sure the thread exists to test deletion
beforeEach(async () => {
  const threadExists = await db
    .table('threads')
    .get(defaultThread.id)
    .run();

  if (threadExists.deletedAt) {
    return db
      .table('threads')
      .get(defaultThread.id)
      .update({
        deletedAt: db.literal(),
      })
      .run();
  }
});

const variables = {
  threadId: defaultThread.id,
};

it('should be able to delete self-published thread', async () => {
  const query = /* GraphQL */ `
    mutation deleteThread($threadId: ID!) {
      deleteThread (threadId: $threadId)
    },
  `;

  const context = {
    user: member,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should be able to delete thread if user owns community', async () => {
  const query = /* GraphQL */ `
    mutation deleteThread($threadId: ID!) {
      deleteThread (threadId: $threadId)
    },
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it("should not delete thread if user doesn't have permissions", async () => {
  const query = /* GraphQL */ `
    mutation deleteThread($threadId: ID!) {
      deleteThread (threadId: $threadId)
    },
  `;

  const context = {
    user: noPermissionUser,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should not delete thread if user is not signed in', async () => {
  const query = /* GraphQL */ `
    mutation deleteThread($threadId: ID!) {
      deleteThread (threadId: $threadId)
    },
  `;

  const context = {
    user: null,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});
