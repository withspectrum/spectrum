// @flow
const { db } = require('./db');

export const getThread = (id: string): Promise<Object> => {
  return db
    .table('threads')
    .get(id)
    .run();
};
