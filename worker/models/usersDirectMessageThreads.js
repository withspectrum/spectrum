// @flow
const { db } = require('./db');

export const getDirectMessageThreadMembers = (
  id: string
): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(id, { index: 'threadId' })
    .run();
};
