// @flow
import { events } from 'shared/analytics';
import { getNotification } from '../models/notification';
import { trackQueue } from 'shared/bull/queues';

export const trackNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await getNotification(notificationId);
  return trackQueue.add({
    userId,
    event: events.NOTIFICATION_RECEIVED,
    properties: {
      event: notification.event,
      id: notification.id,
    },
  });
};
