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
import {
  updateRecurringPaymentPeriod,
  getRecurringPaymentFromSubscriptionId,
} from '../../models/recurringPayment';

export const processInvoicePaid = async (event: Object) => {
  // the object field contains all the data related to the event
  const { data: { object } } = event;

  // fetch the subscription record from stripe as it contains a few new fields we need below
  const getSubscription = await stripe.subscriptions.retrieve(
    object.subscription
  );
  // we need to retrieve a community id for the payment, if one exists
  const rPayment = await getRecurringPaymentFromSubscriptionId(
    object.subscription
  );
  // get the customer object from stripe
  const customer = await stripe.customers.retrieve(object.customer);
  // create an invoice record in the database (receipt)
  const invoice = await createInvoice(
    object,
    getSubscription,
    customer,
    rPayment
  );
  // update the recurringPayment record in the database that triggered this invoice payment and update the period_end and period_start dates to show in the ui
  const updateRecurringPayment = await updateRecurringPaymentPeriod(object);

  return Promise.all([getSubscription, invoice, updateRecurringPayment]);
};
