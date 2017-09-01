// @flow
const { db } = require('./db');

export const getActiveThreadsInPastWeek = (): Promise<Array<Object>> => {
  return db
    .table('threads')
    .filter(
      db.row('lastActive').during(
        // Change this to 60*60*24*7 to get weekly active users
        db.now().sub(60 * 60 * 24 * 7),
        db.now()
      )
    )
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};
