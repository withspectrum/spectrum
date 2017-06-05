// @flow
const { db } = require('./db');

export const getMessageById = (id: string): Promise<Object> => {
  return db.table('messages').get(id).run();
};
