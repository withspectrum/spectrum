// @flow
const { db } = require('./db');

export const getUsersChannelsEligibleForWeeklyDigest = (
  userId: string
): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter({ isMember: true })
    .map(row => row('channelId'))
    .run();
};
