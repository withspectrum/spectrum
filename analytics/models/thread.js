// @flow
import type { DBThread } from 'shared/types';
import { db } from 'shared/db';

export const getThreadById = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};
