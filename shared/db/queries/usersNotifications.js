// @flow
const { db, createReadQuery, createWriteQuery } = require('shared/db');
import type { DBNotification } from 'shared/types';
/*
===========================================================

    MODIFYING AND CREATING DATA IN USERSNOTIFICATIONS

===========================================================
*/

export const markSingleNotificationSeen = createWriteQuery(
  (notificationId: string, userId: string) => ({
    query: db
      .table('usersNotifications')
      .getAll([userId, notificationId], { index: 'userIdAndNotificationId' })
      .update({
        isSeen: true,
      })
      .run()
      .then(() => {
        return true;
      })
      .catch(err => false),
    invalidateTags: () => [notificationId, userId],
  })
);

export const markNotificationsSeen = createWriteQuery(
  (userId: string, notifications: Array<string>) => ({
    query: db
      .table('usersNotifications')
      .getAll(...notifications.map(nId => [userId, nId]), {
        index: 'userIdAndNotificationId',
      })
      .update({
        isSeen: true,
      })
      .run()
      .then(() => {
        return true;
      }),
    invalidateTags: () => [userId, ...notifications],
  })
);

export const markAllNotificationsSeen = createWriteQuery((userId: string) => ({
  query: db
    .table('usersNotifications')
    .getAll([userId, false], { index: 'userIdAndIsSeen' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip()
    .filter(row => row('context')('type').ne('DIRECT_MESSAGE_THREAD'))
    .run()
    .then(notifications =>
      markNotificationsSeen(
        userId,
        notifications
          .filter(notification => !!notification)
          .map(notification => notification.id)
      )
    )
    .then(() => true)
    .catch(err => false),
  invalidateTags: () => [userId],
}));

export const markDirectMessageNotificationsSeen = createWriteQuery(
  (userId: string) => ({
    query: db
      .table('usersNotifications')
      .getAll([userId, false], { index: 'userIdAndIsSeen' })
      .eqJoin('notificationId', db.table('notifications'))
      .without({ left: ['createdAt', 'id'] })
      .zip()
      .filter(row => row('context')('type').eq('DIRECT_MESSAGE_THREAD'))
      .run()
      .then(notifications =>
        markNotificationsSeen(
          userId,
          notifications
            .filter(notification => !!notification)
            .map(notification => notification.id)
        )
      )
      .then(() => true)
      .catch(err => false),
    invalidateTags: () => [userId],
  })
);

export const storeUsersNotifications = createWriteQuery(
  (notificationId: string, userId: string) => ({
    query: db
      .table('usersNotifications')
      .insert({
        createdAt: new Date(),
        entityAddedAt: new Date(),
        notificationId,
        userId,
        isSeen: false,
        isRead: false,
      })
      .run()
      .then(res => {
        return res;
      }),
    invalidateTags: () => [userId, notificationId],
  })
);

export const markUsersNotificationsAsNew = createWriteQuery(
  (notificationId: string, userId: string) => ({
    query: db
      .table('usersNotifications')
      .getAll([userId, notificationId], { index: 'userIdAndNotificationId' })
      .run()
      .then(result => {
        /*
				If a user becomes a new participant on the notification before the time buffer runs out, we need to ensure that we include them in setting a notification.

				So in this section we check to see if an existing usersNotifications row exists, otherwise we create a new one. All users passed into this function should return an updated or new usersNotifications record.
			*/
        if (result && result.length > 0) {
          return db
            .table('usersNotifications')
            .getAll([userId, notificationId], {
              index: 'userIdAndNotificationId',
            })
            .update({
              isRead: false,
              isSeen: false,
              entityAddedAt: new Date(),
            })
            .run();
        } else {
          return storeUsersNotifications(notificationId, userId);
        }
      }),
    invalidateTags: () => [notificationId, userId],
  })
);

/*
===========================================================

        GETTING DATA FROM USERS NOTIFICATIONS

===========================================================
*/

export const getUsersNotifications = createReadQuery((userId: string) => ({
  query: db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .eqJoin('notificationId', db.table('notifications'))
    .without({ left: ['createdAt', 'id'] })
    .zip(),
  tags: (notifications: Array<DBNotification>) => [
    userId,
    ...notifications.map(n => n.id),
  ],
}));
