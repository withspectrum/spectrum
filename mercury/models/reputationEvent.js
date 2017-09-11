// @flow
const { db } = require('./db');

export const saveReputationEvent = ({
  userId,
  type,
  communityId,
}: {
  userId: string,
  type: string,
  communityId: string,
}): Promise<Object> => {
  return db
    .table('reputationEvents')
    .insert({
      timestamp: new Date(),
      userId,
      type,
      communityId,
    })
    .run();
};
