// @flow
const debug = require('debug')('pluto:queues:processCommunityEdited');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { stripe } from 'shared/stripe';
import { getCommunityById, setStripeCustomerId } from '../models/community';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community edited ${communityId}`);

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

  if (!stripeCustomerId) {
    debug(`No Stripe customer yet for ${communityId}`);
    debug(`Creating a Stripe customer for ${communityId}`);

    const { id: createdStripeId } = await stripe.customers.create({
      email: administratorEmail,
      metadata: {
        communityId: id,
        communityName: name,
      },
    });

    debug(`Saving created stripeCustomerId to database for ${communityId}`);
    return await setStripeCustomerId(communityId, createdStripeId);
  }

  debug(`Updating Stripe customer for ${communityId}`);
  return await stripe.customers.update(stripeCustomerId, {
    metadata: {
      communityId: id,
      communityName: name,
    },
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
