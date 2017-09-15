// @flow
const { db } = require('./db');
const debug = require('debug')('hermes:queue:send-weekly-digest-email');

export const getUsersCommunityIds = (
  userId: string
): Promise<Array<string>> => {
  debug(userId);
  return (
    db
      .table('usersCommunities')
      .getAll(userId, { index: 'userId' })
      .filter({ isMember: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(
        communities =>
          debug(communities) ||
          communities.map(community => community.communityId)
      )
  );
};
