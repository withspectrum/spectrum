// @flow
const debug = require('debug')('pluto:queues:processAdministratorEmailChanged');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { stripe } from 'shared/stripe';
import { getCommunityById } from '../models/community';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community created ${communityId}`);

  if (!communityId) {
    debug(`No communityId ${communityId}`);
    return;
  }

  const { stripeCustomerId } = await getCommunityById(communityId);

  if (!stripeCustomerId) {
    debug(`No Stripe customer to delete for ${communityId}`);
    return;
  }

  debug(`Deleting Stripe customer for ${communityId}`);
  return await stripe.customers.del(stripeCustomerId);
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
