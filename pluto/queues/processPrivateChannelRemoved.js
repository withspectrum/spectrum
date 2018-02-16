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

    if (!subscriptionItem) {
      // safety check
      debug("Has subscription item, but coudln't fetch it");
      return;
    }

    const quantity = subscriptionItem.quantity;
    if (quantity === 1) {
      debug(`Only one private channel is left, being removed ${communityId}`);
      return await StripeUtil.deleteSubscriptionItem(subscriptionItem.id);
    }

    debug(`More than one private channel is left, decremtn ${communityId}`);
    return await StripeUtil.updateSubscriptionItem({
      subscriptionItemId: subscriptionItem.id,
      quantity: subscriptionItem.quantity - 1,
    });
  }

  debug(
    `Active subscription found, but no private channel item found ${communityId}`
  );
  return;
};

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
