// @flow
import webPush from 'web-push';
const debug = require('debug')('athena:utils:web-push');
import {
  getSubscriptions,
  removeSubscription,
} from '../models/web-push-subscription';
import { markSingleNotificationSeen } from '../models/usersNotifications';
import formatNotification from './notification-formatting';
import type { DBNotification } from 'shared/types';

try {
  webPush.setVapidDetails(
    'https://spectrum.chat',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('Web push notifications to enabled!');
} catch (err) {}

export const sendWebPushNotification = (
  subscription: any,
  payload: Object,
  options?: ?Object
): Promise<Object> => {
  if (!subscription || !payload) {
    if (process.env.NODE_ENV === 'development')
      console.log(
        'No subscription or payload provided to sendWebPushNotification, not pushing anything.'
      );
    return Promise.resolve({});
  }
  if (process.env.NODE_ENV === 'development') {
    debug('not sending web push notification in development');
    return Promise.resolve({});
  }
  const pl =
    typeof payload === 'string'
      ? payload
      : JSON.stringify({
          ...payload,
          raw: undefined,
        });
  return webPush
    .sendNotification(subscription, pl, {
      TTL: 86400, // Default TTL: One day
      ...options,
    })
    .catch(err => {
      if (err.statusCode === 410 && err.endpoint) {
        debug(`old subscription found (${err.endpoint}), removing`, err);
        return removeSubscription(err.endpoint);
      }
    });
};

type DBUsersNotification = {
  ...DBNotification,
  userId: string,
};

// Send a notification as a web push notification (maybe)
export const sendNotificationAsWebPush = (
  notification: DBUsersNotification
) => {
  debug('send notification as web push notification');
  return getSubscriptions(notification.userId)
    .then(subscriptions => {
      if (!subscriptions || subscriptions.length === 0) {
        debug(`no subscription for user#${notification.userId}`);
        return Promise.resolve(false);
      }

      debug('subscription(s) found, formatting notification');
      const payload = formatNotification(notification, notification.userId);
      return Promise.all(
        subscriptions.map(subscription =>
          sendWebPushNotification(subscription, {
            tag: notification.id,
            ...payload,
          })
        )
      );
    })
    .catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
};
