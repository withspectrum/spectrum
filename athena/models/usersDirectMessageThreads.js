// @flow
const { db } = require('./db');

export const getDirectMessageThreadMembers = (
  id: string
): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(id, { index: 'threadId' })
    .filter({ receiveNotifications: true })
    .eqJoin('userId', db.table('users'))
    .without({ right: ['id', 'createdAt'] })
    .zip()
    .run();
};
