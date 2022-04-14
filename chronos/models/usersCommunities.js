// @flow
const { db } = require('shared/db');

// prettier-ignore
export const getUsersCommunityIds = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersCommunities')
    .getAll([userId, true], { index: 'userIdAndIsMember' })('communityId')
    .run();
};
