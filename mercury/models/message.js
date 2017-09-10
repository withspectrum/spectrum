// @flow
const { db } = require('./db');

export const getMessage = (id: string): Promise<Object> => {
  return db
    .table('messages')
    .get(id)
    .run();
};

export const getMessagesByThreadId = (
  threadId: string
): Promise<Array<Object>> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .run();
};
