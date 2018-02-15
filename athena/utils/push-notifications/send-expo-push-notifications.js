// @flow
const debug = require('debug')('athena:utils:send-expo-push-notifications');
import Expo from 'expo-server-sdk';
import { removeExpoSubscription } from 'iris/models/expo-push-subscription';
import Raven from 'shared/raven';
import type { DBExpoPushSubscription } from 'shared/types';

const expo = new Expo();

type PushNotificationPayload = {
  title: string,
  body: string,
  data?: Object,
};

type ExpoPushMessage = {
  to: string,
  data?: Object,
  title?: string,
  body?: string,
  sound?: 'default' | null,
  ttl?: number,
  expiration?: number,
  priority?: 'default' | 'normal' | 'high',
  badge?: number,
};

export const sendExpoPushNotifications = (
  subscriptions: Array<DBExpoPushSubscription>,
  payload: PushNotificationPayload
): Array<Promise<Object>> => {
  let messages: Array<ExpoPushMessage> = [];
  subscriptions.forEach(({ token }) => {
    // TODO(@mxstbr): Remove invalid subscriptions from db
    if (!Expo.isExpoPushToken(token)) {
      debug(`invalid expo token ${token}, not sending push notification.`);
      removeExpoSubscription(token);
      return;
    }

    debug(`sending push notification to token ${token}`);
    messages.push({
      to: token,
      sound: 'default',
      priority: 'high',
      ttl: 86400,
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });
  });

  const chunks = expo.chunkPushNotifications(messages);

  return chunks.map(chunk =>
    expo
      .sendPushNotificationAsync(chunk)
      .then(receipts => {
        if (!receipts.data || receipts.data.length === 0) return;
        return receipts.data
          .filter(({ status }) => status === 'error')
          .map(receipt => {
            if (receipt.details && receipt.details.error) {
              switch (receipt.details.error) {
                case 'DeviceNotRegistered': {
                  // TODO(@mxstbr): Remove the subscription here
                  // This is blocked upstream because the expo push service doesn't return the token
                }
                default: {
                  return Promise.resolve();
                }
              }
            }
          });
      })
      .catch(err => {
        // This means Expo is down or something
        Raven.captureException(err);
      })
  );
};
