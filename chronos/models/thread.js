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
    .between(db.now().sub(range), db.now(), {
      index: 'lastActive',
      leftBound: 'open',
      rightBound: 'open',
    })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getCoreMetricsActiveThreads = (range: number) => {
  return db
    .table('threads')
    .between(db.now().sub(range), db.now(), {
      index: 'lastActive',
      leftBound: 'open',
      rightBound: 'open',
    })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .group('communityId')
    .ungroup()
    .run();
};
