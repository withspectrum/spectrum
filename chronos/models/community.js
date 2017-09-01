// @flow
const { db } = require('./db');

export const getCommunityById = (id: string): Promise<Object> => {
  return db.table('communities').get(id).run();
};
