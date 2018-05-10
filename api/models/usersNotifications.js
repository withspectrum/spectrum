// @flow
const { db } = require('./db');
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { getNotification } from './notification';
/*
===========================================================

    MODIFYING AND CREATING DATA IN USERSNOTIFICATIONS

===========================================================
*/

const trackNotificationSeen = async (
  notificationId: string,
  userId: string
) => {
  const notification = await getNotification(notificationId);
  return trackQueue.add({
    userId,
    event: events.NOTIFICATION_MARKED_AS_SEEN,
    properties: {
      event: notification.event,
      id: notification.id,
    },
  });
};

// marks one notification as read
export const markSingleNotificationSeen = (
  notificationId: string,
  userId: string
): Promise<Object> => {
  trackNotificationSeen(notificationId, userId);

  return db
    .table('usersNotifications')
    .getAll(notificationId, { index: 'notificationId' })
    .filter({
      userId,
    })
    .update(
      {
        isSeen: true,
      },
      { returnChanges: true }
    )
    .run()
    .then(() => true)
    .catch(err => false);
};

export const markNotificationsSeen = (
  userId: string,
  notifications: Array<string>
) => {
  trackQueue.add({
    userId,
    event: events.NOTIFICATIONS_MARKED_AS_SEEN,
  });

  return db
    .table('usersNotifications')
    .getAll(...notifications, { index: 'notificationId' })
    .update({
      isSeen: true,
    })
    .run();
};

// marks all notifications for a user as seen
export const markAllNotificationsSeen = (userId: string): Promise<Object> => {
  return db
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
    .catch(err => false);
};

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
