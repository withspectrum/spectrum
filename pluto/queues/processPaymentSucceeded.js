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
import { StripeUtil } from 'shared/stripe/utils';

const prepareCommunityPaymentSucceededEmail = async (
  communityId: string,
  dbStripeCustomer,
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

  const sources = StripeUtil.getSources(dbStripeCustomer);

  if (!sources || sources.length === 0) {
    debug(`A payment occurred without a source`);
    return;
  }

  const defaultSource = sources.find(source => source && source.isDefault);

  if (!defaultSource) {
    debug(`A payment occurred without a default source on file`);
    return;
  }

  const emailData = {
    to: adminEmail,
    community: community,
    invoice: record,
    source: defaultSource,
  };

  return sendCommunityPaymentSucceededEmailQueue.add(emailData);
};

const processJob = async (
  job: Job<StripePaymentSucceededOrFailedEventJobData>
) => {
  const { data: { record } } = job;
  const customerId = record.customer;

  debug(`Payment succeeded for customer ${customerId}`);

  // $FlowFixMe
  const dbStripeCustomer = await getStripeCustomer(customerId);

  if (
    dbStripeCustomer &&
    dbStripeCustomer.metadata &&
    dbStripeCustomer.metadata.communityId
  ) {
    debug('Found communityId for customer, sending success email');
    return await prepareCommunityPaymentSucceededEmail(
      dbStripeCustomer.metadata.communityId,
      dbStripeCustomer,
      record
    );
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
