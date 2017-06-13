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
  let now = new Date();
  let nowTime = now.getTime();
  let then = nowTime - TIME_BUFFER;
  then = new Date(then);

  console.log('now', now, '\nthen', then);

  const thenYear = then.getFullYear();
  const thenMonth = then.getMonth() + 1;
  const thenDay = then.getDate();
  const thenHours = then.getHours();
  const thenMinutes = then.getMinutes();
  const thenSeconds = then.getSeconds();
  const zone = 'Z';

  return db
    .table('notifications')
    .getAll(contextId, { index: 'contextId' })
    .filter(notification =>
      notification('event')
        .eq(event)
        .and(
          notification('modifiedAt')
            .date()
            .during(
              db.time(
                thenYear,
                thenMonth,
                thenDay,
                thenHours,
                thenMinutes,
                thenSeconds,
                zone
              ),
              db.now()
            )
        )
    )
    .run()
    .then(notifications => {
      if (!notifications || notifications.length === 0) return null;
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
