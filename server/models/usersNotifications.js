// @flow
const { db } = require('./db');
// $FlowFixMe
import UserError from '../utils/UserError';

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
  getUsersNotifications,
};
