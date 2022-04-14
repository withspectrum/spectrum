// @flow
const debug = require('debug')('api:models:webPushSubscription');
const { db } = require('shared/db');
import type { WebPushSubscription } from '../mutations/user';

// prettier-ignore
// export const storeSubscription = (subscription: WebPushSubscription, userId: string) => {
//   debug(
//     `store subscription for user#${userId}, endpoint ${subscription.endpoint}`
//   );
//   return db
//     .table('webPushSubscriptions')
//     .insert({
//       ...subscription,
//       userId,
//     })
//     .run();
// };

//* mongodb
export const storeSubscription = (subscription: WebPushSubscription, userId: string) => {
  debug(
    `store subscription for user#${userId}, endpoint ${subscription.endpoint}`
  );
  return db
    .collection('webPushSubscriptions')
    .insertOne({
      ...subscription,
      userId,
    })
};

// export const getSubscriptions = (userId: string) => {
//   debug(`get subscriptions for user#${userId}`);
//   return db
//     .table('webPushSubscriptions')
//     .getAll(userId, { index: 'userId' })
//     .run();
// };

//* mongodb
export const getSubscriptions = (userId: string) => {
  debug(`get subscriptions for user#${userId}`);
  return db.collection('webPushSubscriptions').findOne({ userId: userId });
};

export const removeSubscription = (endpoint: string) => {
  debug(`remove subscription ${endpoint}`);
  return db
    .table('webPushSubscriptions')
    .getAll(endpoint, { index: 'endpoint' })
    .delete()
    .run();
};
