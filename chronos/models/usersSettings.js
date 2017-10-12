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

  return (
    db
      .table('usersSettings')
      .filter(row => row('notifications')('types')(range)('email').eq(true))
      .eqJoin('userId', db.table('users'))
      .zip()
      .pluck(['userId', 'email', 'firstName', 'name', 'username', 'lastSeen'])
      // save some processing time by making sure the user has an email address
      .filter(row => row('email').ne(null))
      // save some processing time by making sure the user has a username
      .filter(row => row.hasFields('username').and(row('username').ne(null)))
      // save some processing time by making sure the user was active in the last month
      .filter(
        db.row('lastSeen').during(db.now().sub(60 * 60 * 24 * 30), db.now())
      )
      .pluck(['userId', 'email', 'firstName', 'name', 'username'])
      .distinct()
      .run()
  );
};
