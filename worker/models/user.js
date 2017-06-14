// @flow
const { db } = require('./db');

export const getUserById = (id: string): Promise<Object> => {
  return db.table('users').get(id).run();
};
