// @flow
const { db } = require('./db');

export const getActiveThreadsInTimeframe = (timeframe: string) => {
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
    .table('threads')
    .filter(db.row('lastActive').during(db.now().sub(range), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};
