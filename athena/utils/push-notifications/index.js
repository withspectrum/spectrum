// @flow
const debug = require('debug')('athena:utils:send-push-notifications');
import { getSubscriptions } from '../../models/web-push-subscription';
import { getExpoSubscriptions } from 'api/models/expo-push-subscription';
import formatNotification from 'shared/notification-to-text';
import { sendWebPushNotification } from './send-web-push-notification';
import { sendExpoPushNotifications } from './send-expo-push-notifications';
import type { DBNotificationsJoin } from 'shared/types';

const sendPushNotifications = async (notification: DBNotificationsJoin) => {
  debug('send notification as web push notification');

  const [expoSubscriptions = [], webPushSubscriptions = []] = await Promise.all(
    [
      getExpoSubscriptions(notification.userId),
      getSubscriptions(notification.userId),
    ]
  );

  debug(
    `expo subscriptions: ${expoSubscriptions.length}\nweb push subscriptions: ${
      webPushSubscriptions.length
    }`
  );

  if (expoSubscriptions.length === 0 && webPushSubscriptions.length === 0)
    return;

  const payload = formatNotification(notification, notification.userId);

  debug(`send push notifications`);
  const webPushNotifications = webPushSubscriptions.map(subscription => {
    return sendWebPushNotification(subscription, {
      tag: notification.id,
      ...payload,
    });
  });
  const expoPushNotifications = sendExpoPushNotifications(
    expoSubscriptions,
    payload
  );

  return Promise.all([...webPushNotifications, ...expoPushNotifications]);
};

export default sendPushNotifications;
