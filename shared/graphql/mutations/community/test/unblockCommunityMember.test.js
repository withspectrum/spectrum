//@flow
import { request } from '../../../../../iris/test/utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

const owner = data.users.find(({ username }) => username === 'mxstbr');
const member = data.users.find(({ username }) => username === 'bryn');
const nonMember = data.users.find(({ username }) => username === 'bad-boy');
const previousMember = data.users.find(
  ({ username }) => username === 'previous-boy'
);
const blockedMember = data.users.find(
  ({ username }) => username === 'blocked-boy'
);

const input = { communityId: data.communities[0].id, userId: blockedMember.id };
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
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  expect.assertions(2);
  const result = await request(query, { variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should fail if current user is not a member of the community', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  const context = {
    user: nonMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should fail if evaluated user is not a member of the community', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
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
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should fail if evaluated user used to be a member but is not any more', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
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
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it("should fail if the community doesn't exist", async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  const thisInput = { communityId: 'blah', userId: member.id };
  const thisVariables = { input: thisInput };

  const context = {
    user: owner,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should fail if evaluated user is not blocked in the community', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  const thisInput = {
    communityId: data.communities[0].id,
    userId: member.id,
  };
  const thisVariables = { input: thisInput };

  const context = {
    user: owner,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should fail if current user is not an owner of the community', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  const context = {
    user: member,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.unblockCommunityMember).toEqual(null);
});

it('should block a member in the community', async () => {
  const query = /* GraphQL */ `
    mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
      unblockCommunityMember (input: $input)
    }
  `;

  const context = { user: owner };

  expect.assertions(6);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  expect(result.data.unblockCommunityMember).toEqual(true);

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
  expect(communityConnections[0].isBlocked).toEqual(false);
  expect(communityConnections[0].isMember).toEqual(true);
  expect(communityConnections[0].receiveNotifications).toEqual(true);
});
