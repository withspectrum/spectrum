//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

const channel = data.channels[0];
// various permissions for Spectrum community
const owner = data.users.find(({ username }) => username === 'mxstbr');
const noPermissionUser = data.users.find(({ username }) => username === 'bryn');

afterEach(() => {
  return db
    .table('channels')
    .filter({ slug: channel.slug })
    .update({ ...channel })
    .run();
});

const variables = {
  input: {
    name: 'edited name',
    slug: 'edited-slug',
    description: 'edited description',
    isPrivate: false,
    channelId: channel.id,
  },
};

it('should edit a channel if user is owner', async () => {
  const query = /* GraphQL */ `
    mutation editChannel($input: EditChannelInput!) {
      editChannel (input: $input) {
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

  expect.assertions(4);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  expect(result.data.editChannel.name).toEqual(variables.input.name);
  expect(result.data.editChannel.slug).toEqual(variables.input.slug);
  expect(result.data.editChannel.description).toEqual(
    variables.input.description
  );
});

it('should not edit a channel if user is not owner', async () => {
  const query = /* GraphQL */ `
    mutation editChannel($input: EditChannelInput!) {
      editChannel (input: $input) {
        name
        slug
        description
        isPrivate
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

it('should not edit a channel if user is not signed in', async () => {
  const query = /* GraphQL */ `
    mutation editChannel($input: EditChannelInput!) {
      editChannel (input: $input) {
        name
        slug
        description
        isPrivate
      }
    },
  `;

  expect.assertions(1);

  const result = await request(query, { variables });
  expect(result).toMatchSnapshot();
});
