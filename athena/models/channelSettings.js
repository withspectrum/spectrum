// @flow
const { db } = require('./db');

export const getChannelSettings = (id: string) => {
  return db
    .table('channelSettings')
    .getAll(id, { index: 'channelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) return null;
      return data[0];
    });
};
