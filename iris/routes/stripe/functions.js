// @flow
// $FlowFixMe
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
// $FlowFixMe
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const STRIPE_WEBHOOK_SECRET = process.env['STRIPE_WEBHOOK_SECRET'];
// $FlowFixMe
const stripe = require('stripe')(STRIPE_TOKEN),
  currency = 'USD';

import { createInvoice } from '../../models/invoice';
import { updateRecurringPaymentPeriod } from '../../models/recurringPayment';

export const invoicePaid = async (event: Object) => {
  // the object field contains all the data related to the event
  const { data: { object } } = event;

  const getSubscription = await stripe.subscriptions.retrieve(
    object.subscription
  );
  const invoice = await createInvoice(object, getSubscription);
  const updateRecurringPayment = updateRecurringPaymentPeriod(object);

  return { getSubscription, invoice, updateRecurringPayment };
};
