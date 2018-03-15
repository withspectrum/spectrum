// @flow
const debug = require('debug')('pluto:queues:process-oss-status-disabled');
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
  debug(`Handling moderation seats during oss status disabled ${communityId}`);

  const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    'moderator-seat'
  );

  const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    'oss-moderator-seat'
  );

  // if the community has neither an oss moderator seat or a paid moderator seat, return
  if (!subscriptionItem && !ossSubscriptionItem) {
    debug('Has neither paid or oss subscription items, abort');
    return;
  }

  let promises = [];
  // we only care about making changes here if the user was taking advantage
  // of the oss moderator seat
  if (ossSubscriptionItem) {
    debug(`Removing oss moderator seat ${communityId}`);
    promises.push(StripeUtil.deleteSubscriptionItem(ossSubscriptionItem.id));

    // if the user had an oss moderator seat as well as other paid moderator
    // seats, only increment the existing subscription item
    if (subscriptionItem) {
      debug(`Incrementing paid moderator seat ${communityId}`);
      promises.push(
        StripeUtil.updateSubscriptionItem({
          subscriptionItemId: subscriptionItem.id,
          quantity: subscriptionItem.quantity + 1,
        })
      );
    } else {
      // otherwise if the user had an oss moderator seat but no other paid
      // moderator seats, add a new subscription item for a paid moderator seat
      debug(`Add paid moderator seat ${communityId}`);
      promises.push(
        StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: 'moderator-seat',
        })
      );
    }
  }

  return await Promise.all([...promises]);
};

const handlePrivateChannels = async (
  customer,
  activeSubscription,
  communityId
) => {
  debug(`Handling private channels during oss status disabled ${communityId}`);

  const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    'private-channel'
  );

  const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
    customer,
    'oss-private-channel'
  );

  // if the community has neither an oss moderator seat or a paid moderator seat, return
  if (!subscriptionItem && !ossSubscriptionItem) {
    debug('Has neither paid or oss subscription items, abort');
    return;
  }

  let promises = [];
  // we only care about making changes here if the user was taking advantage
  // of the oss moderator seat
  if (ossSubscriptionItem) {
    debug(`Removing oss private channel ${communityId}`);
    promises.push(StripeUtil.deleteSubscriptionItem(ossSubscriptionItem.id));

    // if the user had an oss moderator seat as well as other paid moderator
    // seats, only increment the existing subscription item
    if (subscriptionItem) {
      debug(`Incrementing paid private channels ${communityId}`);
      promises.push(
        StripeUtil.updateSubscriptionItem({
          subscriptionItemId: subscriptionItem.id,
          quantity: subscriptionItem.quantity + 1,
        })
      );
    } else {
      // otherwise if the user had an oss moderator seat but no other paid
      // moderator seats, add a new subscription item for a paid moderator seat
      debug(`Add paid private channel ${communityId}`);
      promises.push(
        StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: 'private-channel',
        })
      );
    }
  }

  return await Promise.all([...promises]);
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
    Raven.captureException(err);
  }
};
