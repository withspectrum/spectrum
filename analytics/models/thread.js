// @flow
import type { DBThread } from 'shared/types';
import { db } from './db';

export const getThreadById = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};
