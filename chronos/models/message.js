// @flow
const { db } = require('./db');

export const getTotalMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .count()
    .run();
};

export const getNewMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(
      db.row('timestamp').during(
        // only count messages sent in the past week
        db.now().sub(60 * 60 * 24 * 7),
        db.now()
      )
    )
    .count()
    .run();
};
