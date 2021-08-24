// @flow
import type { DBUsersThreads } from 'shared/types';
const { db } = require('shared/db');

// prettier-ignore
export const deleteParticipantInThread = (threadId: string, userId: string): Promise<boolean> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .delete()
    .run()
};

// prettier-ignore
export const getParticipantsInThread = (threadId: string): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ isParticipant: true })
    .eqJoin('userId', db.table('users'))
    .without({
      left: ['createdAt', 'id', 'threadId', 'userId'],
    })
    .zip()
    .run();
};

export const getParticipantsInThreads = (threadIds: Array<string>) => {
  return db
    .table('usersThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .filter({ isParticipant: true })
    .eqJoin('userId', db.table('users'))
    .group(rec => rec('left')('threadId'))
    .without({
      left: ['createdAt', 'id', 'userId'],
    })
    .zip()
    .run();
};
