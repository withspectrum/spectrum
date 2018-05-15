// @flow
const debug = require('debug')('pluto:queues:process-moderator-added');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import removeAllPaidFeatures from './removeAllPaidFeatures';
import { StripeUtil } from 'shared/stripe/utils';
import { FREE_MODERATOR_SEAT, MODERATOR_SEAT } from './constants';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing moderator added ${communityId}`);

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
    return await removeAllPaidFeatures(communityId);
  }

  if (activeSubscription) {
    debug(`Active subscription found ${communityId}`);
    if (StripeUtil.hasSubscriptionItemOfType(customer, MODERATOR_SEAT)) {
      debug(`Moderator seat subscription item found ${communityId}`);
      const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        MODERATOR_SEAT
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

    debug(`No active paid moderator seat subscription item ${communityId}`);
    if (community.ossVerified) {
      debug(`Community is oss verified${communityId}`);
      const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        FREE_MODERATOR_SEAT
      );

      if (ossSubscriptionItem) {
        debug(`Community already has oss moderator seat ${communityId}`);
        debug(
          `Adding subscription item to existing subscription ${communityId}`
        );
        return await StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: MODERATOR_SEAT,
        });
      } else {
        debug(`Community does not have oss moderator seat${communityId}`);
        debug(
          `Adding oss subscription item to existing subscription ${communityId}`
        );
        return await StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: FREE_MODERATOR_SEAT,
        });
      }
    } else {
      debug(`Community is not oss verified ${communityId}`);
      debug(`Adding subscription item to existing subscription ${communityId}`);
      return await StripeUtil.addSubscriptionItem({
        subscriptionId: activeSubscription.id,
        subscriptionItemType: MODERATOR_SEAT,
      });
    }
  }

  debug(`Community does not have an active subscription${communityId}`);
  if (community.ossVerified) {
    debug(`Community is oss verified ${communityId}`);
    debug(`Creating first oss subscription ${communityId}`);
    return await StripeUtil.createFirstSubscription({
      customerId: customer.id,
      subscriptionItemType: FREE_MODERATOR_SEAT,
    });
  } else {
    debug(`Community is not oss verified${communityId}`);
    debug(`Creating first subscription ${communityId}`);
    return await StripeUtil.createFirstSubscription({
      customerId: customer.id,
      subscriptionItemType: MODERATOR_SEAT,
    });
  }
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
