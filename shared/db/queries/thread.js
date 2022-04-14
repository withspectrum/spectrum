// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBThread } from 'shared/types';

export const getThreadById = createReadQuery((id: string) => ({
  query: db.table('threads').get(id),
  tags: (thread: ?DBThread) => (thread ? [thread.id] : []),
}));
