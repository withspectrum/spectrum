// @flow
const debug = require('debug')(
  'pluto:queues:process-stripe-invoice-payment-failed'
);
import type {
  Job,
  StripePaymentSucceededOrFailedEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { getStripeCustomer } from '../models/stripeCustomers';
import removeAllPaidFeatures from './removeAllPaidFeatures';

const processJob = async (
  job: Job<StripePaymentSucceededOrFailedEventJobData>
) => {
  const { data: { customerId } } = job;
  debug(`Payment has failed for customer ${customerId}`);

  const dbStripeCustomer = await getStripeCustomer(customerId);

  if (
    dbStripeCustomer &&
    dbStripeCustomer.metadata &&
    dbStripeCustomer.metadata.communityId
  ) {
    debug('Found communityId for customer, removing all paid features');
    return Promise.all([
      removeAllPaidFeatures(dbStripeCustomer.metadata.communityId),
    ]);
  }
};

export default async (job: Job<StripePaymentSucceededOrFailedEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    console.log('❌', job.data);
    Raven.captureException(err);
  }
};
