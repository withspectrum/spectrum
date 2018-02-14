// @flow
const debug = require('debug')('iris:models:expo-push-subscription');
const { db } = require('./db');
import type { DBExpoPushSubscription } from 'shared/types';

export const storeExpoSubscription = (token: string, userId: string) => {
  debug(`store subscription for user#${userId}`);
  return db
    .table('expoPushSubscriptions')
    .insert({
      token,
      userId,
    })
    .run();
};

export const getExpoSubscriptions = (
  userId: string
): Promise<Array<DBExpoPushSubscription>> => {
  debug(`get subscriptions for user#${userId}`);
  return db
    .table('expoPushSubscriptions')
    .getAll(userId, { index: 'userId' })
    .run();
};
