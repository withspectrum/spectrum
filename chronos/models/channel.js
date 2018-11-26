// @flow
const { db } = require('shared/db');

export const getChannelById = (id: string): Promise<Object> => {
  return db
    .table('channels')
    .get(id)
    .run();
};
