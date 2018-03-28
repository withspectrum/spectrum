// @flow
import { db } from './db';

export const getSubscriptions = (
  subscriptions: Array<string>
): Promise<Array<?Object>> => {
  return db
    .table('stripeSubscriptions')
    .getAll(...subscriptions)
    .run();
};

export const getSubscriptionsByCustomerId = async (
  customerId: ?string
): Promise<Array<?Object>> => {
  if (!customerId) return await [];
  return db
    .table('stripeSubscriptions')
    .getAll(customerId, { index: 'customerId' })
    .run();
};
