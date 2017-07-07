// @flow
const { db } = require('./db');
import UserError from '../utils/UserError';
import type { WebPushSubscription } from '../mutations/user';

export const storeSubscription = (
  subscription: WebPushSubscription,
  userId: string
) => {
  return db.table('webPushSubscriptions').insert({
    ...subscription,
    userId,
  });
};

export const removeSubscription = (endpoint: string) => {
  return db.table('webPushSubscriptions').get(endpoint).delete();
};
