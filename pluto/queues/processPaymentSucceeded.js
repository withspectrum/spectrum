// @flow
const debug = require('debug')(
  'pluto:queues:process-stripe-invoice-payment-succeeded'
);
import type {
  Job,
  StripePaymentSucceededOrFailedEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';

/*

  If an administrator email changes on a Spectrum community we need to reflect
  that change on the Stripe customer

*/
const processJob = async (
  job: Job<StripePaymentSucceededOrFailedEventJobData>
) => {
  const { data: { customerId } } = job;
  console.log('PAYMENT SUCCEEDED JOB CUSTOMER', customerId);
  return;
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
