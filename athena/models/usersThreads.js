// @flow
const { db } = require('./db');
import type { DBUsersThreads } from 'shared/types';

export const getThreadNotificationUsers = (
  id: string
): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(id, { index: 'threadId' })
    .filter({ receiveNotifications: true })
    .eqJoin('userId', db.table('users'))
    .without({ right: ['id', 'createdAt'] })
    .zip()
    .run();
};

export const getUsersThread = (
  userId: string,
  threadId: string
): Promise<?DBUsersThreads> => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .run()
    .then(data => {
      // if no record exists
      if (!data || data.length === 0) return null;
      // otherwise only return the first record (in case of duplicates)
      return data[0];
    });
};

export const getUserNotificationPermissionsInThread = (
  userId: string,
  threadId: string
): Promise<Boolean> => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .run()
    .then(data => data[0].receiveNotifications);
};
