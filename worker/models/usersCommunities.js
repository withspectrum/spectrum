// @flow
const { db } = require('./db');

export const getMembersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isMember: true, receiveNotifications: true })
      .run()
      // return an array of the userIds to be loaded by gql
      .then(users => users.map(user => user.userId))
  );
};
