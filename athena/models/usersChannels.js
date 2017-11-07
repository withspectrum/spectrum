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
