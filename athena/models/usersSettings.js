// @flow
const { db } = require('./db');

export const getUsersSettings = (userId: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(results => {
      if (results && results.length > 0) return results[0];
    });
};
