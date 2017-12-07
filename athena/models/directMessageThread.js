// @flow
const { db } = require('./db');
import type { DBDirectMessageThread } from 'shared/types';

export const getDirectMessageThreadById = (
  id: string
): Promise<DBDirectMessageThread> => {
  return db
    .table('directMessageThreads')
    .get(id)
    .run();
};
