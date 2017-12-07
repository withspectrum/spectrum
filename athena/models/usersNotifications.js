// @flow
const { db } = require('./db');
import type { DBUsersNotifications } from 'shared/types';

export const storeUsersNotifications = (
  notificationId: string,
  userId: string
): Promise<DBUsersNotifications> => {
  return db
    .table('usersNotifications')
    .insert({
      createdAt: new Date(),
      entityAddedAt: new Date(),
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
    .getAll(notificationId, { index: 'notificationId' })
    .filter({ userId })
    .run()
    .then(result => {
      /*
				If a user becomes a new participant on the notification before the time buffer runs out, we need to ensure that we include them in setting a notification.

				So in this section we check to see if an existing usersNotifications row exists, otherwise we create a new one. All users passed into this function should return an updated or new usersNotifications record.
			*/
      if (result && result.length > 0) {
        return db
          .table('usersNotifications')
          .getAll(notificationId, { index: 'notificationId' })
          .filter({ userId })
          .update({
            isRead: false,
            isSeen: false,
            entityAddedAt: new Date(),
          })
          .run();
      } else {
        return storeUsersNotifications(notificationId, userId);
      }
    });
};
