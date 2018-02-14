// @flow
const debug = require('debug')('pluto:webhooks:sourceEvent');
import type { RawSource } from '../types/Source';
import { stripeCustomerEventQueue } from 'shared/bull/queues';
import { stripe } from 'shared/stripe';

type SourceJob = {
  data: {
    record: RawSource,
  },
};
/*
  We treat the customer object on Stripe as our source of truth. When sources
  change, it might not always cause an update to the customer record in stripe.
  This processor ensures that any time a Source event occurs we grab the
  latest customer data from stripe and update that record in our database.
*/
export const processSourceEvent = async (job: SourceJob) => {
  const { data: { record } } = job;
  debug(`New job for source ${record.id}`);

  const customer = await stripe.customers.retrieve(record.customer);
  return stripeCustomerEventQueue.add({ record: customer });
};
