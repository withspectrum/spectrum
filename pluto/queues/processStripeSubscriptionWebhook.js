// @flow
const debug = require('debug')('pluto:webhooks:subscriptionEvent');
import type { Job, StripeWebhookEventJobData } from 'shared/bull/types';
import { stripeCustomerWebhookEventQueue } from 'shared/bull/queues';
import { stripe } from 'shared/stripe';

/*
  We treat the customer object on Stripe as our source of truth. When subscriptions
  change, it might not always cause an update to the customer record in stripe.
  This processor ensures that any time a subscription event occurs we grab the
  latest customer data from stripe and update that record in our database.
*/
export default async (job: Job<StripeWebhookEventJobData>) => {
  const { data: { record } } = job;
  debug(`New job for subscription ${record.id}`);

  const customer = await stripe.customers.retrieve(record.customer);
  return stripeCustomerWebhookEventQueue.add({ record: customer });
};
