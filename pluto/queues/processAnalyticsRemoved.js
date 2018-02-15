// @flow
const debug = require('debug')('pluto:queues:processAnalyticsRemoved');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { stripe } from 'shared/stripe';
import { getCommunityById, setCommunityAnalytics } from '../models/community';

const processJob = async (job: Job<StripeCommunityPaymentEventJobData>) => {
  const { data: { communityId } } = job;

  debug(`Processing analytics removed for ${communityId}`);

  if (!communityId) {
    debug(`No communityId ${communityId}`);
    return;
  }

  const {
    stripeCustomerId,
    administratorEmail,
    hasAnalytics,
  } = await getCommunityById(communityId);

  // if this job somehow mistakenly runs, we double check that in fact the community
  // does want analytics
  if (hasAnalytics) {
    debug(`Community ${communityId} has analytics turned on, abort`);
  }

  // if no admin email exists, a user is likely trying to bypass our clientside
  // checks - in this case force analytics off
  if (!administratorEmail) {
    debug(`No administrator email for ${communityId}`);
    return await setCommunityAnalytics(communityId, false);
  }

  // if a stripeCustomerId doesn't exist yet, we've somehow failed to create
  // a customer for this community at some previous step; we can do it here now
  if (!stripeCustomerId) {
    debug(
      `No Stripe customer exists yet, create a customer for ${communityId}`
    );
    return;
  }

  /*
    otherwise if a Stripe customer already exists, we need to:
    1. Check to see if an existing subscription exists
    1a. If yes, ensure that analytics is a subscription item
      1aa. If yes, remove the subscriptionItem
      1ab. If no, abort
    1b. If no, abort
  */

  const { subscriptions } = await stripe.customers.retrieve(stripeCustomerId);

  // 1
  if (subscriptions.data.length > 0) {
    // 1a
    debug(`Customer has an existing subscription ${communityId}`);
    const subscriptionToEvaluate = subscriptions.data[0];

    if (
      subscriptionToEvaluate.items.data.some(
        item => item.plan.id === 'community-analytics'
      )
    ) {
      // 1aa
      debug(
        `Community ${communityId} has an analytics subscription, remove it`
      );

      const subscriptionItem = subscriptionToEvaluate.items.data.filter(
        item => item.plan.id === 'community-analytics'
      )[0];

      debug(`Deleting subscriptionItem ${subscriptionItem.id}`);
      return await stripe.subscriptionItems.del(subscriptionItem.id);
    }

    // 1ab
    debug(`There is no analytics subscriptionItem for ${communityId}, abort`);
    return;
  } else {
    // 1b
    debug(`Customer does not have an existing subscription ${communityId}`);
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
