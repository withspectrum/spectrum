// @flow
const { db } = require('./db');

// prettier-ignore
export const getUsersForDigest = (timeframe: string): Promise<Array<Object>> => {
  let range = timeframe === 'daily' ? 'dailyDigest' : 'weeklyDigest';
  return db
    .table('usersSettings')
    .getAll(true, { index: `${range}Email` })
    .eqJoin('userId', db.table('users'))
    .zip()
    .pluck(['userId', 'email', 'firstName', 'name', 'username'])
    .run()
};
