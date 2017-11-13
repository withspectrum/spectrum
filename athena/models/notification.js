// @flow
const { db } = require('./db');
import type { NotificationEventType, DBNotification } from 'shared/types';
import { TIME_BUFFER } from '../queues/constants';

/*
	Given an event type, the context of that event, and a time range, see if an existing notification exists. If it does, we will bundle the new incoming notification on the server. If no existing notification is found, we create a new one
*/
export const checkForExistingNotification = (
  event: NotificationEventType,
  contextId: string
): Promise<?DBNotification> => {
  const now = new Date();
  const then = new Date(now.getTime() - TIME_BUFFER);
  return db
    .table('notifications')
    .getAll(contextId, { index: 'contextId' })
    .filter(notification =>
      notification('event')
        .eq(event)
        .and(
          notification('modifiedAt').during(
            db.ISO8601(then.toISOString()),
            db.now()
          )
        )
    )
    .run()
    .then(notifications => {
      if (!notifications || notifications.length === 0) return null;
      return notifications[0];
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};

export const storeNotification = (
  notification: Object
): Promise<DBNotification> => {
  return db
    .table('notifications')
    .insert(
      {
        ...notification,
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

export const updateNotification = (
  notification: Object
): Promise<DBNotification> => {
  return db
    .table('notifications')
    .get(notification.id)
    .update(
      {
        ...notification,
        modifiedAt: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

export const getNotifications = (notificationIds: Array<string>) => {
  return db
    .table('notifications')
    .getAll(...notificationIds)
    .eqJoin('id', db.table('usersNotifications'), { index: 'notificationId' })
    .without({ right: ['id'] })
    .zip()
    .run();
};
