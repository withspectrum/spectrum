// @flow
const debug = require('debug')(
  'pluto:queues:process-administrator-email-changed'
);
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';

/*

  If an administrator email changes on a Spectrum community we need to reflect
  that change on the Stripe customer

*/
const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing administrator email changed for ${communityId}`);

  const { community, customer } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug('Error getting community in preflight');
    return;
  }

  if (!customer) {
    debug('Error fetching or creating customer in preflight');
    return;
  }

  debug(`Updating the email address on Stripe for ${communityId}`);
  return await StripeUtil.updateCustomer({
    administratorEmail: community.administratorEmail,
    communityId: community.id,
    communityName: community.name,
    customerId: customer.id,
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
