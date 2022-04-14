// @flow
import type { DBUsersThreads } from 'shared/types';
const { db } = require('shared/db');

// invoked only when a thread is created or a user leaves a message on a thread.
// Because a user could leave multiple messages on a thread, we first check
// to see if a record exists with a relationship. If it does, we return and
// do nothing. If it doesn't, we create the relationship.
// prettier-ignore
export const createParticipantInThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(result => {
      // if a result already exists, the user has an existing relationship
      // with this thread
      if (result && result.length > 0) {
        // if they are already a participant, we can return
        const { id, isParticipant, receiveNotifications } = result[0];
        if (isParticipant) return;

        // otherwise, mark them as a participant
        return db
          .table('usersThreads')
          .get(id)
          .update({
            isParticipant: true,
            // if receiveNotifications is null, it means that the user is leaving
            // their first message on the thread, so this should set it to true
            receiveNotifications: receiveNotifications === false ? false : true,
          })
          .run();
      } else {
        // if there is no relationship with the thread, create one
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

// prettier-ignore
export const deleteParticipantInThread = (threadId: string, userId: string): Promise<boolean> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .delete()
    .run()
};

// Users can opt in to notifications on a thread without having to leave a message or be the thread creator. This will only activate notifications and the user will not appear as a participant in the UI
// prettier-ignore
export const createNotifiedUserInThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersThreads')
    .insert({
      createdAt: new Date(),
      userId,
      threadId,
      isParticipant: false,
      receiveNotifications: true,
    })
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

// prettier-ignore
export const getThreadNotificationStatusForUser = (threadId: string, userId: string): Promise<?DBUsersThreads> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};

type UserIdAndThreadId = [string, string];

// prettier-ignore
export const getThreadsNotificationStatusForUsers = (input: Array<UserIdAndThreadId>) => {
  return db
    .table('usersThreads')
    .getAll(...input, { index: 'userIdAndThreadId' })
    .run()
    .then(result => {
      if (!result) return Array.from({ length: input.length }).map(() => null);

      return result;
    });
};

// prettier-ignore
export const updateThreadNotificationStatusForUser = (threadId: string, userId: string, value: boolean): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(results => {
      // if no record exists, the user is trying to mute a thread they
      // aren't a member of - e.g. someone mentioned them in a thread
      // so create a record
      if (!results || results.length === 0) {
        return db.table('usersThreads').insert({
          createdAt: new Date(),
          userId,
          threadId,
          isParticipant: false,
          receiveNotifications: value,
        })
        .run()
      }

      const record = results[0];
      return db
        .table('usersThreads')
        .get(record.id)
        .update({
          receiveNotifications: value,
        })
        .run();
    });
};

// when a thread is deleted, we make sure all relationships to that thread have notifications turned off
// prettier-ignore
export const turnOffAllThreadNotifications = (threadId: string): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .update({
      receiveNotifications: false,
    })
    .run();
};

export const disableAllThreadNotificationsForUser = (userId: string) => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .update({
      receiveNotifications: false,
    })
    .run();
};
