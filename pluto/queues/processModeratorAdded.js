// @flow
const debug = require('debug')('pluto:queues:processCommunityEdited');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { removeAllCommunityModerators } from '../models/usersCommunities';
import { StripeUtil } from './stripe-utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing community edited ${communityId}`);

  const {
    community,
    customer,
    hasChargeableSource,
    activeSubscription,
  } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug(`Error getting community in preflight ${communityId}`);
    return;
  }

  if (!customer) {
    debug(`Error fetching or creating customer in preflight ${communityId}`);
    return;
  }

  // if a user was able to add a moderator but doesn't have a valid source on
  // file, they aren't allowed to actually have moderators - reset them
  if (!hasChargeableSource) {
    debug(`No chargeable source on file, abort ${communityId}`);
    return removeAllCommunityModerators(communityId);
  }

  if (activeSubscription) {
    debug(`Active subscription found ${communityId}`);
    if (StripeUtil.hasSubscriptionItemOfType(customer, 'moderator-seat')) {
      debug(`Moderator seat subscription item found ${communityId}`);
      const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        'moderator-seat'
      );

      if (!subscriptionItem) {
        // safety check
        debug("Has subscription item, but coudln't fetch it");
        return;
      }

      debug(`Updating subscription item ${communityId}`);
      return await StripeUtil.updateSubscriptionItem({
        subscriptionItemId: subscriptionItem.id,
        quantity: subscriptionItem.quantity + 1,
      });
    }

    debug(`Adding subscription item to existing subscription ${communityId}`);
    return await StripeUtil.addSubscriptionItem({
      subscriptionId: activeSubscription.id,
      subscriptionItemType: 'moderator-seat',
    });
  }

  debug(`Creating first subscription ${communityId}`);
  return await StripeUtil.createFirstSubscription({
    customerId: customer.id,
    subscriptionItemType: 'moderator-seat',
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
