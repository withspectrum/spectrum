// @flow
const { db } = require('./db');

export const getMembersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isMember: true, receiveNotifications: true })
    .run()
    .then(users => users.map(user => user.userId));
};

export const getOwnersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isOwner: true })
    .run()
    .then(users => users.map(user => user.userId));
};
