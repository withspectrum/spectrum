// @flow
const { db } = require('./db');
import type { DBThread } from 'shared/types';

export const getThread = (id: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(id)
    .run();
};

export const getParticipantCount = (threadId: string): Promise<number> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ isParticipant: true })
    .count()
    .default(0)
    .run();
};

export const getMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .default(0)
    .run();
};

export const getReactionCount = (threadId: string): Promise<number> => {
  return db
    .table('threadReactions')
    .getAll(threadId, { index: 'threadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .count()
    .default(0)
    .run();
};

export const storeThreadScore = (
  threadId: string,
  score: number
): Promise<any> => {
  return db
    .table('threads')
    .get(threadId)
    .update({
      score,
      scoreUpdatedAt: new Date(),
    })
    .run();
};
