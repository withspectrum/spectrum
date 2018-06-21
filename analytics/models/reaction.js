// @flow
import type { DBReaction, DBThreadReaction } from 'shared/types';
import { db } from './db';

export const getReactionById = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};

export const getThreadReactionById = (
  reactionId: string
): Promise<DBThreadReaction> => {
  return db
    .table('threadReactions')
    .get(reactionId)
    .run();
};
