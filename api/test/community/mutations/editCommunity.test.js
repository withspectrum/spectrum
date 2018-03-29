//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

// various permissions for Spectrum community
const community = data.communities[0];
const owner = data.users.find(({ username }) => username === 'mxstbr');
const member = data.users.find(({ username }) => username === 'bryn');

afterEach(() => {
  return db
    .table('communities')
    .filter({ slug: 'spectrum' })
    .update({
      name: community.name,
      description: community.description,
    })
    .run();
});

const variables = {
  input: {
    name: 'new name',
    description: 'new description',
    communityId: community.id,
  },
};

it('should edit a community name and description', async () => {
  const query = /* GraphQL */ `
    mutation editCommunity($input: EditCommunityInput!) {
      editCommunity (input: $input) {
        name
        description
      }
    },
  `;

  const context = { user: owner };

  expect.assertions(3);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  expect(result.data.editCommunity.name).toEqual(variables.input.name);
  expect(result.data.editCommunity.description).toEqual(
    variables.input.description
  );
});

it('should prevent community from being edited by a non owner', async () => {
  const query = /* GraphQL */ `
    mutation editCommunity($input: EditCommunityInput!) {
      editCommunity (input: $input) {
        name
        description
      }
    },
  `;

  const context = { user: member };

  expect.assertions(1);

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should prevent community from being edited by a non user', async () => {
  const query = /* GraphQL */ `
    mutation editCommunity($input: EditCommunityInput!) {
      editCommunity (input: $input) {
        name
        description
      }
    },
  `;

  expect.assertions(1);

  const result = await request(query, { variables });
  expect(result).toMatchSnapshot();
});
