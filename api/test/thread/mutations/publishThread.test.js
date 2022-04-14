//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

// various permissions for Spectrum community
const member = data.users.find(({ username }) => username === 'mxstbr');
const noPermissionUser = data.users.find(
  ({ username }) => username === 'bad-boy'
);

afterEach(() => {
  return db
    .table('threads')
    .filter({ content: { title: 'test thread' } })
    .delete()
    .run();
});

const variables = {
  thread: {
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    type: 'DRAFTJS',
    content: {
      title: 'test thread',
      body: '',
    },
  },
};

it('should create a thread if user has permissions', async () => {
  const query = /* GraphQL */ `
    mutation publishThread($thread: ThreadInput!) {
      publishThread (thread: $thread) {
        isPublished
        isLocked
        type
        content {
          title
        }
      }
    },
  `;

  const context = {
    user: member,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should prevent thread publish if user has no permissions', async () => {
  const query = /* GraphQL */ `
    mutation publishThread($thread: ThreadInput!) {
      publishThread (thread: $thread) {
        isPublished
        isLocked
        type
        content {
          title
        }
      }
    },
  `;

  const context = {
    user: noPermissionUser,
  };

  expect.assertions(1);
  const result = await request(query, { context, variables });

  expect(result).toMatchSnapshot();
});

it('should prevent signed out users from publishing a thread', async () => {
  const query = /* GraphQL */ `
    mutation publishThread($thread: ThreadInput!) {
      publishThread (thread: $thread) {
        isPublished
        isLocked
        type
        content {
          title
        }
      }
    },
  `;

  expect.assertions(1);
  const result = await request(query, { variables });

  expect(result).toMatchSnapshot();
});
