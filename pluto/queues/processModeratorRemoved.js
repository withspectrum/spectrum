// @flow
const debug = require('debug')('pluto:queues:process-moderator-removed');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';
import { FREE_MODERATOR_SEAT, MODERATOR_SEAT } from './constants';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing moderator removed ${communityId}`);

  const {
    community,
    customer,
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

  // if somehow a user is removing a moderator but they don't have a subscription
  // there's no payments work to undo, return
  if (!activeSubscription) {
    debug(`No active subscription in preflight ${communityId}`);
    return;
  }

  if (StripeUtil.hasSubscriptionItemOfType(customer, MODERATOR_SEAT)) {
    debug(`Has moderator seat subscription item ${communityId}`);
    const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
      customer,
      MODERATOR_SEAT
    );

    const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
      customer,
      FREE_MODERATOR_SEAT
    );

    if (!subscriptionItem && !ossSubscriptionItem) {
      debug('No subscription item and no open source item');
      return;
    }

    if (subscriptionItem) {
      const quantity = subscriptionItem.quantity;
      if (quantity === 1) {
        debug(`Only one moderator seat is left, being removed ${communityId}`);
        return await StripeUtil.deleteSubscriptionItem(subscriptionItem.id);
      }

      debug(`More than one moderator seat is left, decremtn ${communityId}`);
      return await StripeUtil.updateSubscriptionItem({
        subscriptionItemId: subscriptionItem.id,
        quantity: subscriptionItem.quantity - 1,
      });
    }

    if (ossSubscriptionItem) {
      return await StripeUtil.deleteSubscriptionItem(ossSubscriptionItem.id);
    }

    debug("Couldn't fetch subscription item");
    return;
  }

  debug(
    `Active subscription found, but no paid moderator seat item found ${communityId}`
  );
  const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    FREE_MODERATOR_SEAT
  );

  if (ossSubscriptionItem) {
    debug(`Found oss moderator seat ${communityId}`);
    debug(`Removing oss moderator seat ${communityId}`);
    return await StripeUtil.deleteSubscriptionItem(ossSubscriptionItem.id);
  } else {
    debug(`No paid or oss moderator seat subscription items ${communityId}`);
    return;
  }
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
