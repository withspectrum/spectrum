// @flow
const debug = require('debug')(
  'pluto:queues:process-stripe-invoice-payment-failed'
);
import type { Job, StripeCardExpiringWarningJobData } from 'shared/bull/types';
import { sendCommunityCardExpiringWarningEmailQueue } from 'shared/bull/queues';
import Raven from 'shared/raven';
import { getStripeCustomer } from '../models/stripeCustomers';
import { getCommunityById } from '../models/community';

const prepareCommunityCardExpiringWarningEmail = async (
  communityId: string,
  record
) => {
  debug(`Preparing community card expiring warning email ${communityId}`);
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
    source: record,
  };

  return sendCommunityCardExpiringWarningEmailQueue.add(emailData);
};

const processJob = async (job: Job<StripeCardExpiringWarningJobData>) => {
  const { data: { record } } = job;
  const customerId = record.customer;

  if (!customerId) {
    debug(`Customer id field doesnt exist on this object`);
    return;
  }

  debug(`Card is expiring for customer ${customerId}`);

  const dbStripeCustomer = await getStripeCustomer(customerId);

  if (
    dbStripeCustomer &&
    dbStripeCustomer.metadata &&
    dbStripeCustomer.metadata.communityId
  ) {
    debug('Found communityId for customer');
    return Promise.all([
      prepareCommunityCardExpiringWarningEmail(
        dbStripeCustomer.metadata.communityId,
        record
      ),
    ]);
  }

  debug(`Did not find communityId for payment failed charge ${record.id}`);
};

export default async (job: Job<StripeCardExpiringWarningJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    console.log('❌', job.data);
    Raven.captureException(err);
  }
};
