// @flow
const { db } = require('./db');

export const updateReputation = (
  userId: string,
  communityId: string,
  score: number
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ communityId })
    .update({
      reputation: db.row('reputation').add(score),
    })
    .run();
};
