// @flow
const { db } = require('./db');
import type { DBUsersDirectMessageThread } from 'shared/types';

// creates a single member in a direct message thread. invoked when a user is added
// to an existing direct message thread (group thread only)
// prettier-ignore
export const createMemberInDirectMessageThread = (threadId: string, userId: string, setActive: boolean): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .insert(
      {
        threadId,
        userId,
        createdAt: new Date(),
        lastActive: setActive ? new Date() : null,
        lastSeen: setActive ? new Date() : null,
        receiveNotifications: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// removes a single member from a channel. will be invoked if a user leaves
// a channel
// prettier-ignore
export const removeMemberInDirectMessageThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .update({ deletedAt: new Date() })
    .run();
};

// removes all the user relationships to a dm thread. will be invoked when a
// dm thread is permanently deleted, at which point we don't want any records in the
// database to show a user relationship to the deleted thread
// prettier-ignore
export const removeMembersInDirectMessageThread = (threadId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .update({ deletedAt: new Date() })
    .run();
};

// prettier-ignore
export const setUserLastSeenInDirectMessageThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      lastSeen: db.now(),
    })
    .run()
    .then(() =>
      db
        .table('directMessageThreads')
        .get(threadId)
        .run()
    );
};

// prettier-ignore
export const updateDirectMessageThreadNotificationStatusForUser = (threadId: string, userId: string, val: boolean): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      receiveNotifications: val,
    })
    .run();
};

// prettier-ignore
export const archiveDirectMessageThread = (threadId: string): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .get(threadId)
    .update(
      {
        archivedAt: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
};

// prettier-ignore
export const unarchiveDirectMessageThread = (threadId: string): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .get(threadId)
    .update(
      {
        archivedAt: db.literal(),
        receiveNotifications: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
};

// prettier-ignore
export const leaveDirectMessageThread = (threadId: string): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .get(threadId)
    .update(
      {
        deletedAt: new Date(),
        receiveNotifications: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
};

// prettier-ignore
export const muteDirectMessageThread = (threadId: string): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .get(threadId)
    .update(
      { 
        receiveNotifications: false,
        mutedAt: new Date()
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
};

// prettier-ignore
export const unmuteDirectMessageThread = (threadId: string): Promise<DBUsersDirectMessageThread> => {
  return db
    .table('usersDirectMessageThreads')
    .get(threadId)
    .update(
      { 
        receiveNotifications: true,
        mutedAt: db.literal()
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
};

// prettier-ignore
export const getDirectMessageThread = (threadId: string, userId: string): Promise<Array<?DBUsersDirectMessageThread>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .filter(row => row.hasFields('deletedAt').not())
    .run()
};

// prettier-ignore
export const getMembersInDirectMessageThread = (threadId: string): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .zip()
    .run()
};

// for loader
// prettier-ignore
export const getMembersInDirectMessageThreads = (threadIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .group(rec => rec('left')('threadId'))
    .zip()
    .run();
};

export const isMemberOfDirectMessageThread = (
  threadId: string,
  userId: string
) => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })('userId')
    .filter(row => row.hasFields('deletedAt').not())
    .contains(userId)
    .run();
};
