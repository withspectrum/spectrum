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
const createUsersNotification = (
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
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

// marks one notification as read
const markNotificationAsRead = (
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
const markNotificationAsSeen = (
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

// marks all notifiations as read
const markAllNotificationsAsRead = (userId: string): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .update({
      isRead: true,
    })
    .run();
};

// marks all notifications for a user as seen
const markAllUserNotificationsSeen = (userId: string): Promise<Object> => {
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
          return markNotificationAsSeen(notification.notificationId, userId);
        })
      );
    })
    .then(() => getNotificationsByUser(userId));
};

const markDirectMessageNotificationsAsSeen = (
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
          return markNotificationAsSeen(notification.notificationId, userId);
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

const getUsersNotifications = (userId: string): Promise<Array<string>> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .run();
};

module.exports = {
  createUsersNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markAllUserNotificationsSeen,
  markDirectMessageNotificationsAsSeen,
  getUsersNotifications,
};
