// @flow
import { db } from 'iris/models/db';
const debug = require('debug')('pluto:models:stripeSubscriptions');

export const resetCustomerSubscriptions = (customerId: string) => {
  debug(`Reseting subscriptions in db for ${customerId}`);
  return db
    .table('stripeSubscriptions')
    .getAll(customerId, { index: 'customerId' })
    .delete()
    .run();
};
