// @flow
const { db } = require('shared/db');

export const getMembersInChannelWithNotifications = (
  channelId: string
): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll(
      [channelId, 'member'],
      [channelId, 'moderator'],
      [channelId, 'owner'],
      { index: 'channelIdAndRole' }
    )
    .filter({ receiveNotifications: true })
    .group('userId')
    .run()
    .then(users => users.map(u => u.group));
};

export const getUserPermissionsInChannel = (
  userId: string,
  channelId: string
): Promise<Object> => {
  return db
    .table('usersChannels')
    .getAll([userId, channelId], { index: 'userIdAndChannelId' })
    .group('userId')
    .run()
    .then(groups => {
      // if no relationship exists
      if (!groups || groups.length === 0) {
        return {
          isMember: false,
          isBlocked: false,
          isPending: false,
        };
      }

      return groups[0].reduction[0]; // returns the usersChannel record
    });
};

// get the email address and id of all the channel owners
export const getOwnersInChannel = (
  channelId: string
): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll([channelId, 'owner'], { index: 'channelIdAndRole' })
    .map(user => user('userId'))
    .run();
};

export const getModeratorsInChannel = (
  channelId: string
): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll([channelId, 'moderator'], { index: 'channelIdAndRole' })
    .map(user => user('userId'))
    .run();
};
