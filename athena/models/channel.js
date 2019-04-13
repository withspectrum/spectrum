// @flow
const { db } = require('shared/db');
import type { DBChannel } from 'shared/types';

export const getChannelById = (id: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(id)
    .run();
};
