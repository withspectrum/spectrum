// @flow
const { db } = require('./db');

export const getChannelById = (id: string): Promise<Object> => {
  return db.table('channels').get(id).run();
};
