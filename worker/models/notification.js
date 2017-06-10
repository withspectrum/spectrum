// @flow
const { db } = require('./db');
import type { EventTypes } from '../utils/types';
import { TIME_BUFFER } from '../queues/constants';

/*
  Given an event type, the context of that event, and a time range, see if an existing notification exists. If it does, we will bundle the new incoming notification on the server. If no existing notification is found, we create a new one
*/
export const checkForExistingNotification = (
  event: EventTypes,
  contextId: string
) => {
  let now = new Date().getTime();
  let then = now - TIME_BUFFER;
  now = new Date(now);
  then = new Date(then);

  return db
    .table('notifications')
    .getAll(contextId, { index: 'contextId' })
    .filter(
      notification =>
        // notification event type matches
        notification('event').eq(event)
      // and was posted between the current date and the time buffer
      //TODO FIX THIS DURING QUERY
      // .and(notification('modifiedAt').during(db.time(now), db.time(then)))
    )
    .run()
    .then(notifications => {
      // if no matching notification exists, return
      if (!notifications || notifications.length === 0) return null;
      // if a match was found, only return the most recent match
      return notifications[0];
    });
};

export const storeNotification = (notification: Object): Promise<Object> => {
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

export const updateNotification = (notification: Object): Promise<Object> => {
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
