// @flow
const { db } = require('./db');

export const getTotalMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run();
};

export const getNewMessageCount = (
  threadId: string,
  timeframe: string
): Promise<number> => {
  let range;
  switch (timeframe) {
    case 'daily': {
      range = 60 * 60 * 24;
      break;
    }
    case 'weekly': {
      range = 60 * 60 * 24 * 7;
      break;
    }
    default: {
      range = 60 * 60 * 24 * 7;
    } // default to weekly
  }

  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .filter(
      db.row('timestamp').during(
        // only count messages sent in the past week
        db.now().sub(range),
        db.now()
      )
    )
    .count()
    .run();
};
