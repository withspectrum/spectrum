// @flow
const { db } = require('./db');

export const getMembersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([communityId, true], { index: 'communityIdAndIsMember' })
    .filter({ receiveNotifications: true })
    .run()
    .then(users => users.map(user => user.userId));
};

export const getOwnersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([communityId, true], { index: 'communityIdAndIsOwner' })
    .run()
    .then(users => users.map(user => user.userId));
};

export const getModeratorsInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([communityId, true], { index: 'communityIdAndIsModerator' })
    .run()
    .then(users => users.map(user => user.userId));
};

export const getUserPermissionsInCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ userId })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0];
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return {
          isOwner: false,
          isMember: false,
          isModerator: false,
          isBlocked: false,
          receiveNotifications: false,
        };
      }
    });
};
