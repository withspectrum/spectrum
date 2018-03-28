//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

// various permissions for Spectrum community
const owner = data.users.find(({ username }) => username === 'mxstbr');
const moderator = data.users.find(({ username }) => username === 'brian');
const noPermissionUser = data.users.find(({ username }) => username === 'bryn');

afterEach(() => {
  return db
    .table('channels')
    .filter({ slug: 'test-channel' })
    .delete()
    .run();
});

const variables = {
  input: {
    name: 'test channel',
    slug: 'test-channel',
    description: 'test description',
    isPrivate: false,
    isDefault: false,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
  },
};

it('should create a channel if user is owner', async () => {
  const query = /* GraphQL */ `
    mutation createChannel($input: CreateChannelInput!) {
      createChannel (input: $input) {
        name
        slug
        description
        isPrivate
      }
    },
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should prevent duplicate channel slugs in the same community', async () => {
  const query = /* GraphQL */ `
    mutation createChannel($input: CreateChannelInput!) {
      createChannel (input: $input) {
        id
        name
        slug
        description
        isPrivate
        createdAt
      }
    },
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);
  const result = await request(query, {
    context,
    variables: {
      input: {
        ...variables.input,
        slug: 'general',
      },
    },
  });

  expect(result).toMatchSnapshot();
});

it('should prevent signed out users from creating a channel', async () => {
  const query = /* GraphQL */ `
    mutation createChannel($input: CreateChannelInput!) {
      createChannel (input: $input) {
        id
        name
        slug
        description
        isPrivate
        createdAt
      }
    },
  `;

  const context = {
    user: null,
  };

  expect.assertions(1);
  const result = await request(query, { context, variables });

  expect(result).toMatchSnapshot();
});

it('should prevent non owners from creating a channel', async () => {
  const query = /* GraphQL */ `
    mutation createChannel($input: CreateChannelInput!) {
      createChannel (input: $input) {
        id
        name
        slug
        description
        isPrivate
        createdAt
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

it('should prevent moderators from creating a channel', async () => {
  const query = /* GraphQL */ `
    mutation createChannel($input: CreateChannelInput!) {
      createChannel (input: $input) {
        id
        name
        slug
        description
        isPrivate
        createdAt
      }
    },
  `;

  const context = {
    user: moderator,
  };

  expect.assertions(1);
  const result = await request(query, { context, variables });

  expect(result).toMatchSnapshot();
});
