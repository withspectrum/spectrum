// @flow
import { db } from 'shared/db';
import type { DBReaction } from 'shared/types';

type ReactionType = 'like';

export type ReactionInput = {
  messageId: string,
  type: ReactionType,
};

// prettier-ignore
export const getReactions = (messageIds: Array<string>): Promise<Array<DBReaction>> => {
  const distinctMessageIds = messageIds.filter((x, i, a) => a.indexOf(x) == i);
  return db
    .table('reactions')
    .getAll(...distinctMessageIds, { index: 'messageId' })
    .filter(row => row.hasFields('deletedAt').not())
    .group('messageId')
    .run();
};

export const getReaction = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run();
};

// prettier-ignore
export const getReactionsByIds = (reactionIds: Array<string>): Promise<Array<DBReaction>> => {
  return db
    .table('reactions')
    .getAll(...reactionIds)
    .run();
};
