// @flow
const { db } = require('./db');

export const getThreadNotificationUsers = (
  id: string
): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(id, { index: 'threadId' })
    .filter({ receiveNotifications: true })
    .run();
};
