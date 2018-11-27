// @flow
const { db } = require('shared/db');
const debug = require('debug')('hermes:queue:send-weekly-digest-email');

export const getUsersCommunityIds = (
  userId: string
): Promise<Array<string>> => {
  debug(userId);
  return db
    .table('usersCommunities')
    .getAll([userId, true], { index: 'userIdAndIsMember' })('communityId')
    .run();
};
