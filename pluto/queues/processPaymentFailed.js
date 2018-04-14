// @flow
const debug = require('debug')(
  'pluto:queues:process-stripe-invoice-payment-failed'
);
import type {
  Job,
  StripePaymentSucceededOrFailedEventJobData,
} from 'shared/bull/types';
import { sendCommunityPaymentFailedEmailQueue } from 'shared/bull/queues';
import Raven from 'shared/raven';
import { getStripeCustomer } from '../models/stripeCustomers';
import removeAllPaidFeatures from './removeAllPaidFeatures';
import { getCommunityById } from '../models/community';

const prepareCommunityPaymentFailedEmail = async (
  communityId: string,
  record
) => {
  debug(`Preparing community payment failed email ${communityId}`);
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
    charge: record,
  };

  return sendCommunityPaymentFailedEmailQueue.add(emailData);
};

const processJob = async (
  job: Job<StripePaymentSucceededOrFailedEventJobData>
) => {
  const { data: { record } } = job;
  const customerId = record.customer;

  debug(`Payment has failed for customer ${customerId}`);

  // $FlowFixMe
  const dbStripeCustomer = await getStripeCustomer(customerId);

  if (!dbStripeCustomer) {
    debug(`Could not find a stripe customer in the database for ${customerId}`);
    return;
  }

  if (
    dbStripeCustomer &&
    dbStripeCustomer.metadata &&
    dbStripeCustomer.metadata.communityId
  ) {
    const communityId = dbStripeCustomer.metadata.communityId;

    debug('Found communityId for customer, removing all paid features');
    return Promise.all([
      removeAllPaidFeatures(communityId),
      prepareCommunityPaymentFailedEmail(
        dbStripeCustomer.metadata.communityId,
        record
      ),
    ]);
  }

  debug(`Did not find communityId for payment failed charge ${record.id}`);
};

export default async (job: Job<StripePaymentSucceededOrFailedEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
