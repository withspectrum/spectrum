// @flow
const debug = require('debug')('pluto:queues:process-analytics-added');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { StripeUtil } from 'shared/stripe/utils';
import removeAllPaidFeatures from './removeAllPaidFeatures';
import { COMMUNITY_ANALYTICS } from './constants';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing analytics added for ${communityId}`);

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

  if (!community.analyticsEnabled) {
    debug(`Analytics already turned off ${communityId}`);
    return;
  }

  if (!hasChargeableSource) {
    debug(`No chargeable source ${communityId}`);
    return await removeAllPaidFeatures(communityId);
  }

  if (activeSubscription) {
    debug(`Has existing subscription ${communityId}`);

    if (StripeUtil.hasSubscriptionItemOfType(customer, COMMUNITY_ANALYTICS)) {
      debug(
        `Community ${communityId} already has an analytics subscription, abort`
      );
      return;
    }

    debug(`Adding analytics subscriptionItem ${communityId}`);
    return await StripeUtil.addSubscriptionItem({
      subscriptionId: activeSubscription.id,
      subscriptionItemType: COMMUNITY_ANALYTICS,
    });
  }

  // user has a chargeable source, but no active subscription yet
  debug(`Creating initial subscription ${communityId}`);
  return await StripeUtil.createFirstSubscription({
    customerId: customer.id,
    subscriptionItemType: COMMUNITY_ANALYTICS,
  });
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
