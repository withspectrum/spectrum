// @flow
const debug = require('debug')('pluto:queues:process-private-channel-added');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { archiveAllCommunityPrivateChannels } from '../models/channel';
import { StripeUtil } from './stripe-utils';

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

  // if a user was able to add a private chanenl but doesn't have a valid source on
  // file, they aren't allowed to actually have private channels - archive
  // all their private channels in the meantime
  if (!hasChargeableSource) {
    debug(`No chargeable source on file, abort ${communityId}`);
    return archiveAllCommunityPrivateChannels(communityId);
  }

  if (activeSubscription) {
    debug(`Active subscription found ${communityId}`);
    if (StripeUtil.hasSubscriptionItemOfType(customer, 'private-channel')) {
      debug(`Private channel subscription item found ${communityId}`);
      const subscriptionItem = StripeUtil.getSubscriptionItemOfType(
        customer,
        'private-channel'
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
      subscriptionItemType: 'private-channel',
    });
  }

  debug(`Creating first subscription ${communityId}`);
  return await StripeUtil.createFirstSubscription({
    customerId: customer.id,
    subscriptionItemType: 'private-channel',
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
