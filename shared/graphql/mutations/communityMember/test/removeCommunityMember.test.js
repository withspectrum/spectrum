//@flow
import { request } from '../../../../../api/test/utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

const input = { communityId: data.communities[0].id };
const variables = { input };

const owner = data.users.find(({ username }) => username === 'mxstbr');
const moderator = data.users.find(({ username }) => username === 'brian');
const member = data.users.find(({ username }) => username === 'bryn');
const nonMember = data.users.find(({ username }) => username === 'bad-boy');
const blockedMember = data.users.find(
  ({ username }) => username === 'blocked-boy'
);

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

const dropUsersChannels = () =>
  db
    .table('usersChannels')
    .delete()
    .run();

const populateUsersChannels = () =>
  db
    .table('usersChannels')
    .insert(...data.usersChannels)
    .run();

afterAll(
  async () =>
    await Promise.all([dropUsersCommunities(), dropUsersChannels()]).then(
      async () =>
        await Promise.all([populateUsersChannels(), populateUsersCommunities()])
    )
);

it('should fail if user is not authenticated', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  expect.assertions(2);
  const result = await request(query, { variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.removeCommunityMember).toEqual(null);
});

it('should fail if user is blocked in the community', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const context = {
    user: blockedMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.removeCommunityMember).toEqual(null);
});

it('should fail if user owns the community', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const context = {
    user: owner,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.removeCommunityMember).toEqual(null);
});

it('should remove moderators from the community', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const context = {
    user: moderator,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(
    result.data.removeCommunityMember.communityPermissions.isMember
  ).toEqual(false);
  expect(
    result.data.removeCommunityMember.communityPermissions.isModerator
  ).toEqual(false);
});

it("should fail if the community doesn't exist", async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const thisVariables = {
    input: {
      communityId: 'blah',
    },
  };

  const context = {
    user: nonMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables: thisVariables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.removeCommunityMember).toEqual(null);
});

it('should fail if user has already left the community', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const context = {
    user: nonMember,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result.errors).toHaveLength(1);
  expect(result.data.removeCommunityMember).toEqual(null);
});

it('should remove a member in the community', async () => {
  const query = /* GraphQL */ `
    mutation removeCommunityMember($input: RemoveCommunityMemberInput!) {
      removeCommunityMember (input: $input) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          isModerator
          reputation
        }
      }
    }
  `;

  const context = { user: member };

  expect.assertions(4);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  expect(
    result.data.removeCommunityMember.communityPermissions.isMember
  ).toEqual(false);

  // ensure only one record still exists
  const getUsersCommunities = (userId, communityId) =>
    db
      .table('usersCommunities')
      .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
      .run();

  const communityConnections = await getUsersCommunities(
    member.id,
    input.communityId
  );

  expect(communityConnections).toHaveLength(1);

  // ensure that all the usersChannels records are marked as non-member
  const channels = await db
    .table('channels')
    .getAll(input.communityId, { index: 'communityId' })
    .run();
  const channelIds = channels.map(channel => channel.id);
  const usersChannels = await db
    .table('usersChannels')
    .getAll(...channelIds, { index: 'channelId' })
    .filter({ userId: member.id })
    .run();

  expect(usersChannels.every(channel => !channel.isMember)).toEqual(true);
});
