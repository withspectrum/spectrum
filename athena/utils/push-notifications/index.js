// @flow
const debug = require('debug')('athena:utils:send-push-notifications');
import { getSubscriptions } from '../../models/web-push-subscription';
import formatNotification from 'shared/notification-to-text';
import { sendWebPushNotification } from './send-web-push-notification';
import type { DBNotificationsJoin } from 'shared/types';

const sendPushNotifications = async (notification: DBNotificationsJoin) => {
  debug('send notification as web push notification');

  const [webPushSubscriptions = []] = await Promise.all([
    getSubscriptions(notification.userId),
  ]);

  debug(`web push subscriptions: ${webPushSubscriptions.length}`);

  if (webPushSubscriptions.length === 0) return;

  const payload = formatNotification(notification, notification.userId);

  debug(`send push notifications`);
  const webPushNotifications = webPushSubscriptions.map(subscription => {
    return sendWebPushNotification(subscription, {
      tag: notification.id,
      ...payload,
    });
  });

  return Promise.all([...webPushNotifications]);
};

export default sendPushNotifications;
