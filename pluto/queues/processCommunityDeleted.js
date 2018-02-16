// @flow
const debug = require('debug')('pluto:queues:process-community-deleted');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community deleted ${communityId}`);

  const { community, customer } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug(`Error getting community in preflight ${communityId}`);
    return;
  }

  if (!customer) {
    debug(`Error fetching or creating customer in preflight ${communityId}`);
    return;
  }

  debug(`Deleting Stripe customer for ${communityId}`);
  return await StripeUtil.deleteCustomer(customer.id);
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
