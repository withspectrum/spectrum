// @flow
const { db } = require('./db');
// $FlowFixMe
import UserError from '../utils/UserError';

// invoked only when a thread is created or a user leaves a message on a thread.
// Because a user could leave multiple messages on a thread, we first check
// to see if a record exists with a relationship. If it does, we return and
// do nothing. If it doesn't, we create the relationship.
export const createParticipantInThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        return;
      } else {
        return db.table('usersThreads').insert({
          createdAt: new Date(),
          userId,
          threadId,
          isParticipant: true,
          receiveNotifications: true,
        });
      }
    });
};

export const createNotifiedUserInThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db.table('usersThreads').insert({
    createdAt: new Date(),
    userId,
    threadId,
    isParticipant: false,
    receiveNotifications: true,
  });
};

export const getParticipantsInThread = (
  threadId: string
): Promise<Array<Object>> => {
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

export const getThreadNotificationStatusForUser = (
  threadId: string,
  userId: string
): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .run();
};

export const updateThreadNotifcationStatuForUser = (
  threadId: string,
  userId: string,
  value: boolean
): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      receiveNotifications: value,
    })
    .run();
};
