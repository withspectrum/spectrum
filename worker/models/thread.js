// @flow
const { db } = require('./db');

export const getThreadById = (id: string): Promise<Object> => {
  return db.table('threads').get(id).run();
};
