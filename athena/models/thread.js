// @flow
const { db } = require('shared/db');
import type { DBThread } from 'shared/types';

export const getThreadById = (id: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(id)
    .run();
};
