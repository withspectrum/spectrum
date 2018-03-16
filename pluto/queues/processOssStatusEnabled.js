// @flow
const debug = require('debug')('pluto:queues:process-oss-status-enabled');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';
import removeAllPaidFeatures from './removeAllPaidFeatures';

const handleModerationSeats = async (
  customer,
  activeSubscription,
  communityId
) => {
  if (StripeUtil.hasSubscriptionItemOfType(customer, 'moderator-seat')) {
    debug(`Has moderator seat subscription item ${communityId}`);
    const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
      customer,
      'moderator-seat'
    );

    if (!subscriptionItem) {
      // safety check
      debug("Has subscription item, but coudln't fetch it");
      return;
    }

    const quantity = subscriptionItem.quantity;

    // if the community is paying for a single moderator, remove that paid moderator
    // and add a free oss moderator seat
    if (quantity === 1) {
      debug(`Only one moderator seat is left, being removed ${communityId}`);
      debug(`Adding oss moderator seat ${communityId}`);
      return await Promise.all([
        StripeUtil.deleteSubscriptionItem(subscriptionItem.id),
        StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: 'oss-moderator-seat',
        }),
      ]);
    }

    // if the community is paying for multiple moderators, only remove one item
    // then add back an oss moderator seat
    debug(`More than one moderator seat is left, decrement ${communityId}`);
    debug(`Adding oss moderator seat ${communityId}`);
    return await Promise.all([
      StripeUtil.updateSubscriptionItem({
        subscriptionItemId: subscriptionItem.id,
        quantity: subscriptionItem.quantity - 1,
      }),
      StripeUtil.addSubscriptionItem({
        subscriptionId: activeSubscription.id,
        subscriptionItemType: 'oss-moderator-seat',
      }),
    ]);
  }
};

const handlePrivateChannels = async (
  customer,
  activeSubscription,
  communityId
) => {
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

    // if the community is paying for a single private channel, remove that paid private channel
    // and add a free oss private channel
    if (quantity === 1) {
      debug(`Only one private channel is left, being removed ${communityId}`);
      debug(`Adding oss private channel ${communityId}`);
      return await Promise.all([
        StripeUtil.deleteSubscriptionItem(subscriptionItem.id),
        StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: 'oss-private-channel',
        }),
      ]);
    }

    // if the community is paying for multiple moderators, only remove one item
    // then add back an oss moderator seat
    debug(`More than one private channel is left, decrement ${communityId}`);
    debug(`Adding oss private channel ${communityId}`);
    return await Promise.all([
      StripeUtil.updateSubscriptionItem({
        subscriptionItemId: subscriptionItem.id,
        quantity: subscriptionItem.quantity - 1,
      }),
      StripeUtil.addSubscriptionItem({
        subscriptionId: activeSubscription.id,
        subscriptionItemType: 'oss-private-channel',
      }),
    ]);
  }
};

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing oss status disabled ${communityId}`);

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

  if (!hasChargeableSource) {
    debug(`No chargeable source on file ${communityId}`);
    return await removeAllPaidFeatures(communityId);
  }

  if (activeSubscription) {
    debug(`Active subscription found ${communityId}`);
    return await Promise.all([
      handleModerationSeats(customer, activeSubscription, communityId),
      handlePrivateChannels(customer, activeSubscription, communityId),
    ]);
  }

  debug(`No active subscription, no action needed ${communityId}`);
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
