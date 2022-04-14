// @flow
const { db } = require('shared/db');

// prettier-ignore
export const getUsersChannelsEligibleForWeeklyDigest = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersChannels')
    .getAll([userId, 'member'], [userId, 'moderator'], [userId, 'owner'], {
      index: 'userIdAndRole',
    })
    .map(row => row('channelId'))
    .run();
};
