//@flow
import { request } from '../../../../../api/test/utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

const owner = data.users.find(({ username }) => username === 'mxstbr');
const moderator = data.users.find(({ username }) => username === 'brian');
const member = data.users.find(({ username }) => username === 'bryn');
const nonMember = data.users.find(({ username }) => username === 'bad-boy');
const previousMember = data.users.find(
  ({ username }) => username === 'previous-boy'
);

const input = { communityId: data.communities[0].id, userId: member.id };
const variables = { input };

const dropUsersCommunities = () =>
  db
    .table('usersCommunities')
    .delete()
    .run();

const populateUsersCommunities = () =>
  db
    .table('usersCommunities')
    .insert(...data.usersCommunities)
    .run();

afterAll(
  async () =>
    await dropUsersCommunities().then(
      async () => await populateUsersCommunities()
    )
);

it('should fail if current user is not authenticated', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  expect.assertions(2);
  const result = await request(query, { variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should fail if current user is not a member of the community', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const context = {
    user: nonMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should fail if evaluated user is not a member of the community', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const context = {
    user: owner,
  };

  const thisInput = {
    communityId: data.communities[0].id,
    userId: nonMember.id,
  };
  const thisVariables = { input: thisInput };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should fail if evaluated user used to be a member but is not any more', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const context = {
    user: owner,
  };

  const thisInput = {
    communityId: data.communities[0].id,
    userId: previousMember.id,
  };
  const thisVariables = { input: thisInput };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it("should fail if the community doesn't exist", async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const thisInput = { communityId: 'blah', userId: nonMember.id };
  const thisVariables = { input: thisInput };

  const context = {
    user: nonMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should fail if evaluated user is already a moderator in the community', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const thisInput = {
    communityId: data.communities[0].id,
    userId: moderator.id,
  };
  const thisVariables = { input: thisInput };

  const context = {
    user: owner,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should fail if current user is not an owner of the community', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const context = {
    user: member,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.addCommunityModerator).toEqual(null);
});

it('should create a moderator in the community', async () => {
  const query = /* GraphQL */ `
    mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
      addCommunityModerator (input: $input) {
        id
      }
    }
  `;

  const context = { user: owner };

  expect.assertions(3);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();

  // ensure that only one record exists for the moderator
  const getUsersCommunities = () =>
    db
      .table('usersCommunities')
      .getAll([input.userId, input.communityId], {
        index: 'userIdAndCommunityId',
      })
      .run();

  const communityConnections = await getUsersCommunities();
  expect(communityConnections).toHaveLength(1);
  expect(communityConnections[0].isModerator).toEqual(true);
});
