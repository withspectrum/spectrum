// @flow
import type { DBReaction } from 'shared/types';
import { db } from './db';

export const getReactionById = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};
