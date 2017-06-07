// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';
import { getNotificationsByUser } from './notification';

/*
===========================================================

    MODIFYING AND CREATING DATA IN USERSNOTIFICATIONS

===========================================================
*/

// creates a single notification in the usersNotifications join table
export const createUsersNotification = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .insert(
      {
        notificationId,
        userId,
        createdAt: new Date(),
        isRead: false,
        isSeen: false,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// marks one notification as read
export const markNotificationRead = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({
      notificationId,
    })
    .update(
      {
        isRead: true,
      },
      { returnChanges: true }
    )
    .run();
};

// marks one notification as read
export const markNotificationSeen = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({
      notificationId,
    })
    .update(
      {
        isSeen: true,
      },
      { returnChanges: true }
    )
    .run();
};

// marks all notifications for a user as seen
export const markAllNotificationsSeen = (userId: string): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications => {
      return Promise.all(
        notifications.map(notification => {
          return markNotificationSeen(notification.notificationId, userId);
        })
      );
    })
    .then(() => getNotificationsByUser(userId));
};

// marks all notifications for a user as read
export const markAllNotificationsRead = (userId: string): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications => {
      return Promise.all(
        notifications.map(notification => {
          return markNotificationRead(notification.notificationId, userId);
        })
      );
    })
    .then(() => getNotificationsByUser(userId));
};

export const markDirectMessageNotificationsSeen = (
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications => {
      return Promise.all(
        notifications.map(notification => {
          return markNotificationSeen(notification.notificationId, userId);
        })
      );
    })
    .then(() => getNotificationsByUser(userId));
};

/*
===========================================================

        GETTING DATA FROM USERS NOTIFICATIONS

===========================================================
*/

export const getUsersNotifications = (
  userId: string
): Promise<Array<string>> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .run();
};
