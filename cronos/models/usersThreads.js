// @flow
const { db } = require('./db');

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
