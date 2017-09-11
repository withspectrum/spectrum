// @flow
const { db } = require('./db');

export const saveReputationEvent = ({
  userId,
  type,
  communityId,
  score,
}: {
  userId: string,
  type: string,
  communityId: string,
  score: number,
}): Promise<Object> => {
  return db
    .table('reputationEvents')
    .insert({
      timestamp: new Date(),
      userId,
      type,
      communityId,
      score,
    })
    .run();
};
