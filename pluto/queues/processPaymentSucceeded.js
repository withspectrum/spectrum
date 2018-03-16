// @flow
const debug = require('debug')(
  'pluto:queues:process-stripe-invoice-payment-failed'
);
import type {
  Job,
  StripePaymentSucceededOrFailedEventJobData,
} from 'shared/bull/types';
import { sendCommunityPaymentSucceededEmailQueue } from 'shared/bull/queues';
import Raven from 'shared/raven';
import { getStripeCustomer } from '../models/stripeCustomers';
import { getCommunityById } from '../models/community';

const prepareCommunityPaymentSucceededEmail = async (
  communityId: string,
  record
) => {
  debug(`Preparing community payment succeeded email ${communityId}`);
  const community = await getCommunityById(communityId);

  if (!community) {
    debug(`Could not fetch community ${communityId}`);
    return;
  }

  const adminEmail = community.administratorEmail;

  if (!adminEmail) {
    debug(`Community does not have admin email ${communityId}`);
    return;
  }

  const emailData = {
    to: adminEmail,
    community: community,
    invoice: record,
  };

  return sendCommunityPaymentSucceededEmailQueue.add(emailData);
};

const processJob = async (
  job: Job<StripePaymentSucceededOrFailedEventJobData>
) => {
  const { data: { record } } = job;
  const customerId = record.customer;

  debug(`Payment succeeded for customer ${customerId}`);

  const dbStripeCustomer = await getStripeCustomer(customerId);

  if (
    dbStripeCustomer &&
    dbStripeCustomer.metadata &&
    dbStripeCustomer.metadata.communityId
  ) {
    debug('Found communityId for customer, sending success email');
    return await prepareCommunityPaymentSucceededEmail(
      dbStripeCustomer.metadata.communityId,
      record
    );
  }

  debug(`Did not find communityId for payment failed charge ${record.invoice}`);
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
