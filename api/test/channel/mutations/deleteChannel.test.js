//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';
import { MAX_ID, BRYN_ID, DATE } from '../../../migrations/seed/default';

const generalChannelId = data.channels[0].id;
const owner = data.users.find(({ username }) => username === 'mxstbr');
const noPermissionUser = data.users.find(({ username }) => username === 'bryn');
const defaultChannelId = 'ce2b4488-4c75-47e0-8ebc-2539c';
const DEFAULT_CHANNELS = [
  {
    id: defaultChannelId,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    name: 'Default',
    description: 'Default chatter',
    slug: 'default',
    isPrivate: false,
    isDefault: true,
  },
];
const DEFAULT_USERS_CHANNELS = [
  {
    createdAt: new Date(),
    userId: MAX_ID,
    channelId: defaultChannelId,
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    isPending: false,
    receiveNotifications: true,
  },
  {
    createdAt: new Date(),
    userId: BRYN_ID,
    channelId: defaultChannelId,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
  },
];
const DEFAULT_THREADS = [
  {
    createdAt: new Date(DATE),
    creatorId: MAX_ID,
    channelId: defaultChannelId,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'The first thread! 🎉',
      body: '',
    },
    edits: [],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE),
  },
  {
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: defaultChannelId,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Another thread',
      body: '',
    },
    edits: [],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1),
  },
  {
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: defaultChannelId,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: '',
    },
    edits: [],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
  },
];

const cleanTables = () =>
  Promise.all([
    db
      .table('channels')
      .delete()
      .run(),
    db
      .table('usersChannels')
      .delete()
      .run(),
    db
      .table('threads')
      .delete()
      .run(),
  ]);

const populateTables = () =>
  Promise.all([
    db
      .table('channels')
      .insert([...DEFAULT_CHANNELS, ...data.channels])
      .run(),
    db
      .table('usersChannels')
      .insert([...DEFAULT_USERS_CHANNELS, ...data.usersChannels])
      .run(),
    db
      .table('threads')
      .insert([...DEFAULT_THREADS, ...data.threads])
      .run(),
  ]);

// after each test just rest the database
beforeEach(() => cleanTables().then(() => populateTables()));
afterEach(() => cleanTables().then(() => populateTables()));

const variables = {
  channelId: defaultChannelId,
};

it('should delete a channel if user is owner', async () => {
  const query = /* GraphQL */ `
    mutation deleteChannel($channelId: ID!) {
      deleteChannel(channelId: $channelId)
    }
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should not delete a channel if user is not owner', async () => {
  const query = /* GraphQL */ `
    mutation deleteChannel($channelId: ID!) {
      deleteChannel(channelId: $channelId)
    }
  `;

  const context = {
    user: noPermissionUser,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should not delete a channel if user is not signed in', async () => {
  const query = /* GraphQL */ `
    mutation deleteChannel($channelId: ID!) {
      deleteChannel(channelId: $channelId)
    }
  `;

  expect.assertions(1);

  const result = await request(query, { variables });
  expect(result).toMatchSnapshot();
});

it('should not delete the general channel', async () => {
  const query = /* GraphQL */ `
    mutation deleteChannel($channelId: ID!) {
      deleteChannel(channelId: $channelId)
    }
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);

  const result = await request(query, {
    context,
    variables: {
      channelId: generalChannelId,
    },
  });
  expect(result).toMatchSnapshot();
});

it('should delete all threads in the deleted channel', async () => {
  const getThreadsInChannel = () =>
    db
      .table('threads')
      .filter({ channelId: defaultChannelId })
      .run();

  const query = /* GraphQL */ `
    mutation deleteChannel($channelId: ID!) {
      deleteChannel(channelId: $channelId)
    }
  `;

  const context = {
    user: owner,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  const threads = await getThreadsInChannel();
  const filtered = threads.filter(t => t.deletedAt !== null).length;
  expect(threads).toHaveLength(filtered);
});
