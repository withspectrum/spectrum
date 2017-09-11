// @flow
const { db } = require('./db');
import { saveReputationEvent } from './reputationEvent';

export const updateReputation = (
  userId: string,
  communityId: string,
  score: number,
  type: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ communityId })
    .update({
      reputation: db.row('reputation').add(score),
    })
    .run()
    .then(() =>
      saveReputationEvent({
        userId,
        type,
        communityId,
      })
    );
};
