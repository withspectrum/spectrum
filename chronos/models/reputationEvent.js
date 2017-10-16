// @flow
const { db } = require('./db');

export const getReputationChangeInTimeframe = (
  userId: string,
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
    .table('reputationEvents')
    .between([userId, db.now().sub(range)], [userId, db.now()], {
      index: 'userIdAndTimestamp',
    })
    .map(row => row('score'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run();
};

export const getTotalReputation = (userId: string): Promise<number> => {
  return db
    .table('reputationEvents')
    .between([userId, db.minval], [userId, db.maxval], {
      index: 'userIdAndTimestamp',
    })
    .map(row => row('score'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run();
};
