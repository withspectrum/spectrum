// @flow
const debug = require('debug')('iris:models:webPushSubscription');
const { db } = require('./db');
import UserError from '../utils/UserError';
import type { WebPushSubscription } from '../mutations/user';

export const storeSubscription = (
  subscription: WebPushSubscription,
  userId: string
) => {
  debug(
    `store subscription for user#${userId}, endpoint ${subscription.endpoint}`
  );
  return db
    .table('webPushSubscriptions')
    .insert({
      ...subscription,
      userId,
    })
    .run();
};

export const getSubscription = (userId: string) => {
  debug(`get subscription for user#${userId}`);
  return db
    .table('webPushSubscriptions')
    .getAll(userId, { index: 'userId' })
    .run();
};

export const removeSubscription = (endpoint: string) => {
  debug(`remove subscription ${endpoint}`);
  return db.table('webPushSubscriptions').get(endpoint).delete().run();
};
