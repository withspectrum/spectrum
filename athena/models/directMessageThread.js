// @flow
const { db } = require('./db');

export const getDirectMessageThreadById = (id: string): Promise<Object> => {
  return db.table('directMessageThreads').get(id).run();
};
