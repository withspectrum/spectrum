// @flow
const debug = require('debug')('pluto:queues:process-private-channel-added');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import removeAllPaidFeatures from './removeAllPaidFeatures';
import { StripeUtil } from 'shared/stripe/utils';
import { PRIVATE_CHANNEL, FREE_PRIVATE_CHANNEL } from './constants';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing private channel added ${communityId}`);

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

  // if a user was able to add a private chanenl but doesn't have a valid source on
  // file, they aren't allowed to actually have private channels - archive
  // all their private channels in the meantime
  if (!hasChargeableSource) {
    debug(`No chargeable source on file, abort ${communityId}`);
    return await removeAllPaidFeatures(communityId);
  }

  if (activeSubscription) {
    debug(`Active subscription found ${communityId}`);
    if (StripeUtil.hasSubscriptionItemOfType(customer, PRIVATE_CHANNEL)) {
      debug(`Private channel subscription item found ${communityId}`);

      const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        PRIVATE_CHANNEL
      );

      if (!subscriptionItem) {
        // safety check
        debug('Could not fetch private channel subscription item');
        return;
      }

      debug(`Increase private channel quantity ${communityId}`);
      return await StripeUtil.updateSubscriptionItem({
        subscriptionItemId: subscriptionItem.id,
        quantity: subscriptionItem.quantity + 1,
      });
    }

    debug(`No paid private channels found ${communityId}`);
    if (community.ossVerified) {
      debug(`Community is oss verified ${communityId}`);
      const ossSubscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        FREE_PRIVATE_CHANNEL
      );

      if (ossSubscriptionItem) {
        debug(`Community already has oss private channel ${communityId}`);
        debug(
          `Add a paid private channel subscription item to existing subscription ${communityId}`
        );
        return await StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: PRIVATE_CHANNEL,
        });
      } else {
        debug(
          `Community does not yet have the oss private channel ${communityId}`
        );
        debug(
          `Adding oss private channel subscription item to existing subscription ${communityId}`
        );
        return await StripeUtil.addSubscriptionItem({
          subscriptionId: activeSubscription.id,
          subscriptionItemType: FREE_PRIVATE_CHANNEL,
        });
      }
    } else {
      debug(`Community is not oss verified ${communityId}`);
      debug(
        `Adding private channel subscription item to existing subscription ${communityId}`
      );
      return await StripeUtil.addSubscriptionItem({
        subscriptionId: activeSubscription.id,
        subscriptionItemType: PRIVATE_CHANNEL,
      });
    }
  }

  debug(`Commuity does not have an active subscription ${communityId}`);
  if (community.ossVerified) {
    debug(`Community is oss verified ${communityId}`);
    debug(`Creating first oss subscription ${communityId}`);
    return await StripeUtil.createFirstSubscription({
      customerId: customer.id,
      subscriptionItemType: FREE_PRIVATE_CHANNEL,
    });
  } else {
    debug(`Creating first subscription ${communityId}`);
    return await StripeUtil.createFirstSubscription({
      customerId: customer.id,
      subscriptionItemType: PRIVATE_CHANNEL,
    });
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
