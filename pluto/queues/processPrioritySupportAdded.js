// @flow
const debug = require('debug')('pluto:queues:process-priority-support-added');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { setPrioritySupport } from '../models/community';
import { StripeUtil } from 'shared/stripe/utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing priority support added for ${communityId}`);

  const {
    activeSubscription,
    hasChargeableSource,
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

  if (!community.prioritySupportEnabled) {
    debug(`Priority support already turned off ${communityId}`);
    return;
  }

  if (!hasChargeableSource) {
    debug(`No chargeable source ${communityId}`);
    return await setPrioritySupport(communityId, false);
  }

  if (activeSubscription) {
    debug(`Has existing subscription ${communityId}`);

    if (StripeUtil.hasSubscriptionItemOfType(customer, 'priority-support')) {
      debug(
        `Community ${communityId} already has priority support subscription, abort`
      );
      return;
    }

    debug(`Adding priority support subscriptionItem ${communityId}`);
    return await StripeUtil.addSubscriptionItem({
      subscriptionId: activeSubscription.id,
      subscriptionItemType: 'priority-support',
    });
  }

  // user has a chargeable source, but no active subscription yet
  debug(`Creating initial subscription ${communityId}`);
  return await StripeUtil.createFirstSubscription({
    customerId: customer.id,
    subscriptionItemType: 'priority-support',
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
