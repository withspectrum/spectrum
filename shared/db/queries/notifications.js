// @flow
import { db } from 'shared/db';
import type { DBNotification } from 'shared/types';

// prettier-ignore
export const getNotification = (notificationId: string): Promise<?DBNotification> => {
  return db
    .table('notifications')
    .get(notificationId)
    .run();
};
