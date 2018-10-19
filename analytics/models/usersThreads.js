// @flow
import type { DBUsersThreads } from 'shared/types';
import { db } from './db';

export const getThreadNotificationStatusForUser = (
  threadId: string,
  userId: string
): Promise<?DBUsersThreads> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};
