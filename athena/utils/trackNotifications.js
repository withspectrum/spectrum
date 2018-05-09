// @flow
import { events, track } from 'shared/analytics';
import { getNotification } from '../models/notification';

export const trackNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await getNotification(notificationId);
  return track(userId, events.NOTIFICATION_RECEIVED, {
    event: notification.event,
    id: notification.id,
  });
};
