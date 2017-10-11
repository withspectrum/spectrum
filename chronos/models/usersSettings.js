// @flow
const { db } = require('./db');

export const getUsersForDigest = (
  timeframe: string
): Promise<Array<Object>> => {
  let range;
  switch (timeframe) {
    case 'daily': {
      range = 'dailyDigest';
    }
    case 'weekly': {
      range = 'weeklyDigest';
    }
  }

  return db
    .table('usersSettings')
    .filter(row => row('notifications')('types')(range)('email').eq(true))
    .eqJoin('userId', db.table('users'))
    .zip()
    .pluck(['userId', 'email', 'firstName', 'name', 'username'])
    .distinct()
    .run();
};
