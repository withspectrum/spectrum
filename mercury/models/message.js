// @flow
const { db } = require('./db');

export const getMessage = (id: string): Promise<Object> => {
  return db
    .table('messages')
    .get(id)
    .run();
};
