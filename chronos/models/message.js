// @flow
const { db } = require('shared/db');
import { getRangeFromTimeframe } from './utils';
import type { Timeframe } from 'chronos/types';

export const getTotalMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run();
};

// prettier-ignore
export const getNewMessageCount = (threadId: string, timeframe: Timeframe): Promise<number> => {
  const range = getRangeFromTimeframe(timeframe)

  return db
    .table('messages')
    .between([threadId, db.now().sub(range)], [threadId, db.now()], {
      index: 'threadIdAndTimestamp',
    })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run();
};
