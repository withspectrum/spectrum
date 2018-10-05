// @flow
const { db, createReadQuery, createWriteQuery } = require('shared/db');
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
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
        trackQueue.add({
          userId,
          event: events.NOTIFICATION_MARKED_AS_SEEN,
          context: { notificationId },
        });
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
        trackQueue.add({
          userId,
          event: events.NOTIFICATIONS_MARKED_AS_SEEN,
        });
      }),
    invalidateTags: () => [userId, ...notifications],
  })
);

export const markAllNotificationsSeen = createWriteQuery((userId: string) => ({
  query: db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({ isSeen: false })
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

export const markDirectMessageNotificationsSeen = (
  userId: string
): Promise<Object> => {
  return db
    .table('usersNotifications')
    .getAll(userId, { index: 'userId' })
    .filter({ isSeen: false })
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
    .catch(err => false);
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
