// @flow
const debug = require('debug')('pluto:queues:process-private-channel-removed');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing private channel removed ${communityId}`);

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

  // if somehow a user is removing a private channel but they don't have a subscription
  // there's no payments work to undo, return
  if (!activeSubscription) {
    debug(`No active subscription in preflight ${communityId}`);
    return;
  }

  if (StripeUtil.hasSubscriptionItemOfType(customer, 'private-channel')) {
    debug(`Has private channel subscription item ${communityId}`);
    const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
      customer,
      'private-channel'
    );

    const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
      customer,
      'oss-private-channel'
    );

    if (!subscriptionItem && !ossSubscriptionItem) {
      debug('No subscription item and no open source item');
      return;
    }

    if (subscriptionItem) {
      const quantity = subscriptionItem.quantity;
      if (quantity === 1) {
        debug(`Only one private channel is left, being removed ${communityId}`);
        return await StripeUtil.deleteSubscriptionItem(subscriptionItem.id);
      }

      debug(`More than one private channel is left, decrement ${communityId}`);
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
    `Active subscription found, but no paid private channel item found ${communityId}`
  );
  const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    'oss-private-channel'
  );

  if (ossSubscriptionItem) {
    debug(`Found oss private channel ${communityId}`);
    debug(`Removing oss private channel ${communityId}`);
    return await StripeUtil.deleteSubscriptionItem(ossSubscriptionItem.id);
  } else {
    debug(`No paid or oss private channel subscription items ${communityId}`);
    return;
  }
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
