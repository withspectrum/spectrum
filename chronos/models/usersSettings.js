// @flow
const { db } = require('./db');

export const getUsersForWeeklyDigest = (): Promise<Array<Object>> => {
  return db
    .table('usersSettings')
    .filter(row =>
      row('notifications')('types')('weeklyDigest')('email').eq(true)
    )
    .eqJoin('userId', db.table('users'))
    .zip()
    .pluck(['userId', 'email', 'firstName', 'name'])
    .distinct()
    .run();
};
