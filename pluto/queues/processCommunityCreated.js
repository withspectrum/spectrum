// @flow
const debug = require('debug')('pluto:queues:process-community-created');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from './stripe-utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community created ${communityId}`);

  const { community } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug(`Error getting community in preflight ${communityId}`);
    return;
  }

  const { stripeCustomerId, administratorEmail, id, name } = community;

  if (stripeCustomerId) {
    debug(`Stripe customer id already exists for community ${communityId}`);
    return;
  }

  debug(`Creating a Stripe customer for ${communityId}`);
  return await StripeUtil.createCustomer({
    administratorEmail,
    communityId: id,
    communityName: name,
  });
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
