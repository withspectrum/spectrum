// @flow
const { db } = require('shared/db');
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

const timeRanges = {
  hourly: { start: 3600, end: 0 },
  daily: { start: 86400, end: 3600 },
  weekly: { start: 604800, end: 86400 },
  rest: { start: Date.now(), end: 604800 },
};

export const getParticipantCountByTime = (
  threadId: string,
  range: 'hourly' | 'daily' | 'weekly' | 'rest'
): Promise<number> => {
  return db
    .table('messages')
    .between(
      [threadId, db.now().sub(timeRanges[range].start)],
      [threadId, db.now().sub(timeRanges[range].end)],
      { index: 'threadIdAndTimestamp' }
    )
    .filter(db.row.hasFields('deletedAt').not())
    .map(rec => rec('senderId'))
    .distinct()
    .count()
    .default(0)
    .run();
};

export const getReactionCountByTime = (
  threadId: string,
  range: 'hourly' | 'daily' | 'weekly' | 'rest'
): Promise<number> => {
  return db
    .table('threadReactions')
    .getAll(threadId, { index: 'threadId' })
    .filter(
      db.row
        .hasFields('deletedAt')
        .not()
        .and(
          db
            .row('createdAt')
            .ge(db.now().sub(timeRanges[range].start))
            .and(db.row('createdAt').le(db.now().sub(timeRanges[range].end)))
        )
    )
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
