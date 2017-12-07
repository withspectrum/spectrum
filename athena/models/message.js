// @flow
const { db } = require('./db');
import type { DBMessage } from 'shared/types';

export const getMessageById = (id: string): Promise<DBMessage> => {
  return db
    .table('messages')
    .get(id)
    .run();
};
