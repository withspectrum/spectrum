// @flow
const { db } = require('./db');
// $FlowFixMe
import UserError from '../utils/UserError';

export const createNewUsersSettings = (userId: string): Promise<Object> => {
  return db.table('usersSettings').insert({
    userId,
    notifications: {
      types: {
        newMessageInThreads: {
          email: true,
        },
      },
    },
  });
};

export const getUsersSettings = (userId: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(results => {
      if (results && results.length > 0) {
        // if the user already has a relationship with the thread we don't need to do anything, return
        return results[0];
      }
    });
};

export const updateUsersNotificationSettings = (
  userId: string,
  settings: object
): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({
      ...settings,
    })
    .run()
    .then(results => console.log('results', results));
};
