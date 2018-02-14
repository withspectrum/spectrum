// @flow
const debug = require('debug')('athena:utils:send-expo-push-notifications');
import Expo from 'expo-server-sdk';
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

  // TODO(@mxstbr): Catch errors here and remove subscriptions, see https://docs.expo.io/versions/latest/guides/push-notifications.html#response-format
  return chunks.map(chunk => expo.sendPushNotificationAsync(chunk));
};
