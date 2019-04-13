// @flow
import { events } from 'shared/analytics';
import { getNotification } from '../notifications';
import { trackQueue } from 'shared/bull/queues';

export const trackNotification = async (
  notificationId: string,
  userId: string
): Promise<void> => {
  const notification = await getNotification(notificationId);
  if (!notification) return;
  return trackQueue.add({
    userId,
    event: events.NOTIFICATION_RECEIVED,
    properties: {
      event: notification.event,
      id: notification.id,
    },
  });
};
