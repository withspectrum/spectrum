// @flow
const { db } = require('shared/db');
import type { DBUsersThreads } from 'shared/types';

export const getThreadNotificationUsers = (
  threadId: string
): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ receiveNotifications: true })
    .eqJoin('userId', db.table('users'))
    .without({ right: ['id', 'createdAt'] })
    .zip()
    .run();
};

export const getUsersThread = (
  userId: string,
  threadId: string
): Promise<?DBUsersThreads> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(data => {
      // if no record exists
      if (!data || data.length === 0) return null;
      // otherwise only return the first record (in case of duplicates)
      return data[0];
    });
};

export const getUserNotificationPermissionsInThread = (
  userId: string,
  threadId: string
): Promise<Boolean> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(data => data[0].receiveNotifications);
};

export const setUserThreadLastSeen = (
  userId: string,
  threadId: string,
  lastSeen: number
): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .update({
      lastSeen,
    })
    .run();
};

export const createUserThread = ({
  userId,
  threadId,
  lastSeen,
  isParticipant,
  receiveNotifications,
}: {
  userId: string,
  threadId: string,
  lastSeen?: Date,
  isParticipant?: boolean,
  receiveNotifications?: boolean,
}) => {
  return db
    .table('usersThreads')
    .insert({
      createdAt: new Date(),
      userId,
      threadId,
      lastSeen: lastSeen || db.literal(),
      isParticipant: isParticipant || false,
      receiveNotifications: receiveNotifications || null,
    })
    .run();
};
