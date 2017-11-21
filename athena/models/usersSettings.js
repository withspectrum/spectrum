// @flow
const { db } = require('./db');
import type { DBUsersSettings } from 'shared/types';

export const getUsersSettings = (userId: string): Promise<?DBUsersSettings> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(results => {
      if (results && results.length > 0) return results[0];
      return null;
    });
};
