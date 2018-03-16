// @flow
const debug = require('debug')('pluto:queues:process-priority-support-removed');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing priority support removed for ${communityId}`);

  const {
    activeSubscription,
    community,
    customer,
  } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug(`Error getting community in preflight ${communityId}`);
    return;
  }

  if (!customer) {
    debug(`Error fetching or creating customer in preflight ${communityId}`);
    return;
  }

  if (community.prioritySupportEnabled) {
    debug(`Has priority support turned on, abort ${communityId}`);
    return;
  }

  if (activeSubscription) {
    debug(`Has an existing subscription ${communityId}`);

    if (StripeUtil.hasSubscriptionItemOfType(customer, 'priority-support')) {
      debug(`Has a priority support subscription, remove it ${communityId}`);

      const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        'priority-support'
      );

      if (!subscriptionItem) {
        // safety check
        debug("Had a priority support subscription, but couldn't retreive it");
        return;
      }

      debug(`Deleting subscriptionItem ${subscriptionItem.id}`);
      return await StripeUtil.deleteSubscriptionItem(subscriptionItem.id);
    }

    debug(
      `There is no priority support subscriptionItem for ${communityId}, abort`
    );
    return;
  }

  debug(`Customer does not have an existing subscription ${communityId}`);
  return;
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    console.log('❌', job.data);
    Raven.captureException(err);
  }
};
