// @flow
import type { DBNotification } from 'shared/types';
import { db } from './db';

export const getNotificationById = (
  notificationId: string
): Promise<DBNotification> => {
  return db
    .table('notifications')
    .get(notificationId)
    .run();
};
