//@flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';

// various permissions for Spectrum community
const community = data.communities[0];
const owner = data.users.find(({ username }) => username === 'mxstbr');
const member = data.users.find(({ username }) => username === 'bryn');
const nonMember = data.users.find(({ username }) => username === 'bad-boy');
const blockedMember = data.users.find(
  ({ username }) => username === 'blocked-boy'
);

const variables = {
  communityId: community.id,
};

const cleanTables = () =>
  Promise.all([
    db
      .table('usersCommunities')
      .delete()
      .run(),
    db
      .table('usersChannels')
      .delete()
      .run(),
  ]);

const populateTables = () =>
  Promise.all([
    db
      .table('usersCommunities')
      .insert(data.usersCommunities)
      .run(),
    db
      .table('usersChannels')
      .insert(data.usersChannels)
      .run(),
  ]);

// after each test just rest the database
beforeEach(() => cleanTables().then(() => populateTables()));

afterAll(() => cleanTables().then(() => populateTables()));

const getUsersChannels = (userId: string) =>
  db
    .table('usersChannels')
    .filter({ userId })
    .run();

const getUsersCommunities = (userId: string, communityId: string) =>
  db
    .table('usersCommunities')
    .getAll([userId, communityId], {
      index: 'userIdAndCommunityId',
    })
    .run();

it('should join a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
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
  expect(result).toMatchSnapshot();
  expect(
    result.data.toggleCommunityMembership.communityPermissions.isMember
  ).toEqual(true);
});

it('should leave a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          reputation
        }
      }
    }
  `;

  const context = {
    user: member,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  expect(
    result.data.toggleCommunityMembership.communityPermissions.isMember
  ).toEqual(false);
});

it('should join all default channels when joining a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
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
  expect(result).toMatchSnapshot();
  const usersChannels = await getUsersChannels(nonMember.id);
  expect(usersChannels).toHaveLength(
    usersChannels.filter(c => c.isMember).length
  );
});

it('should leave all channels when leaving a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          reputation
        }
      }
    }
  `;

  const context = {
    user: member,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  const usersChannels = await getUsersChannels(member.id);
  expect(usersChannels).toHaveLength(
    usersChannels.filter(c => !c.isMember).length
  );
});

it('should prevent a blocked user from joining a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          reputation
        }
      }
    }
  `;

  const context = {
    user: blockedMember,
  };

  expect.assertions(1);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should prevent community owner from leaving community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          reputation
        }
      }
    }
  `;

  const context = {
    user: owner,
  };

  expect.assertions(1);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});

it('should only have one usersCommunities record after joining a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
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
  expect(result).toMatchSnapshot();
  const usersCommunities = await getUsersCommunities(
    nonMember.id,
    community.id
  );
  expect(usersCommunities).toHaveLength(1);
});

it('should only have one usersCommunities record after leaving a community', async () => {
  const query = /* GraphQL */ `
    mutation toggleCommunityMembership($communityId: ID!) {
      toggleCommunityMembership (communityId: $communityId) {
        id
        communityPermissions {
          isMember
          isBlocked
          isOwner
          reputation
        }
      }
    }
  `;

  const context = {
    user: member,
  };

  expect.assertions(2);
  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
  const usersCommunities = await getUsersCommunities(member.id, community.id);
  expect(usersCommunities).toHaveLength(1);
});
