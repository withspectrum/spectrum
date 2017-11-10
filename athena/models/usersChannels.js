// @flow
const { db } = require('./db');

export const getMembersInChannelWithNotifications = (
  channelId: string
): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ isMember: true, receiveNotifications: true })
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
    .getAll(userId, { index: 'userId' })
    .filter({ channelId })
    .group('userId')
    .run()
    .then(groups => {
      // if no relationship exists
      if (!groups || groups.length === 0) {
        return {
          isMember: false,
        };
      }

      return groups[0].reduction; // returns the usersChannel record
    });
};
