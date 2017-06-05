// @flow
const { db } = require('./db');

export const storeUsersNotifications = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .insert({
      createdAt: new Date(),
      notificationId,
      userId,
      isSeen: false,
      isRead: false,
    })
    .run();
};

export const markUsersNotificationsAsNew = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({ notificationId })
    .update({
      isRead: false,
      isSeen: false,
    })
    .run();
};
