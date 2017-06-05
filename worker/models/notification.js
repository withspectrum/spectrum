// @flow
const { db } = require('./db');
import type { EventTypes } from '../utils/types';

export const checkForExistingNotification = (
  event: EventTypes,
  contextId: string,
  timeBuffer: number
) => {
  const now = new Date().getTime();
  const then = now - timeBuffer;

  console.log('4', now);
  console.log('5', then);

  return db
    .table('notifications')
    .getAll(contextId, { index: 'contextId' })
    .filter(notification =>
      // notification event type matches
      notification('event')
        .eq(event)
        // and was posted between the current date and the time buffer
        .and(notification('modifiedAt').during(db.time(now), db.time(then)))
    )
    .run()
    .then(notifications => {
      console.log('6', notifications);
      if (notifications && notifications.length > 0) {
        // a notification exists that meets our criteria, but we will only
        // want to update the latest one
        return notifications[0];
      } else {
        return undefined;
      }
    });
};

export const storeNotification = (notification: Object): Promise<Object> => {
  return db
    .table('notifications')
    .insert({
      ...notification,
      createdAt: new Date(),
      modifiedAt: new Date(),
    })
    .run();
};

export const updateNotification = (notification: Object): Promise<Object> => {
  return db
    .table('notifications')
    .get(notification.id)
    .update({
      ...notification,
      modifiedAt: new Date(),
    })
    .run();
};
