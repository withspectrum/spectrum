// @flow
const debug = require('debug')('pluto:queues:processAdministratorEmailChanged');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import { stripe } from 'shared/stripe';
import { getCommunityById, setStripeCustomerId } from '../models/community';

/*

  If an administrator email changes on a Spectrum community we need to reflect
  that change on the Stripe customer

*/
export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing administrator email changed for ${communityId}`);

  if (!communityId) {
    debug(`No communityId ${communityId}`);
    throw new Error(
      'No communityId sent to processAdministratorEmailChanged job'
    );
  }

  const {
    stripeCustomerId,
    administratorEmail,
    id,
    name,
  } = await getCommunityById(job.data.communityId);

  if (!administratorEmail) {
    debug(`No administrator email for ${communityId}`);
    throw new Error(
      'No administrator email exists, aborting processAdministratorEmailChanged job'
    );
  }

  // if a stripeCustomerId doesn't exist yet, we've somehow failed to create
  // a customer for this community at some previous step; we can do it here now
  if (!stripeCustomerId) {
    debug(
      `No Stripe customer exists yet, create a customer for ${communityId}`
    );
    const { id: createdStripeId } = await stripe.customers.create({
      email: administratorEmail,
      metadata: {
        communityId: id,
        communityName: name,
      },
    });

    return await setStripeCustomerId(communityId, createdStripeId);
  }

  // otherwise a customer already exists on stripe, and we just need to update
  // the email address
  debug(`Updating the email address on Stripe for ${communityId}`);
  return await stripe.customers.update(stripeCustomerId, {
    email: administratorEmail,
  });
};
