// @flow
const debug = require('debug')('pluto:queues:processAdministratorEmailChanged');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { stripe } from 'shared/stripe';
import { getCommunityById, setStripeCustomerId } from '../models/community';

/*

  If an administrator email changes on a Spectrum community we need to reflect
  that change on the Stripe customer

*/
const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community created ${communityId}`);

  if (!communityId) {
    debug(`No communityId ${communityId}`);
    return;
  }

  const {
    stripeCustomerId,
    administratorEmail,
    id,
    name,
  } = await getCommunityById(communityId);

  if (stripeCustomerId) {
    debug('Stripe customer id already exists for community');
    return;
  }

  const { id: createdStripeId } = await stripe.customers.create({
    email: administratorEmail,
    metadata: {
      communityId: id,
      communityName: name,
    },
  });

  debug('Creating new Stripe customer');

  return await setStripeCustomerId(communityId, createdStripeId);
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
