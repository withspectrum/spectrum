// @flow
const debug = require('debug')('pluto:queues:processAnalyticsAdded');
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';
import Raven from 'shared/raven';
import { stripe } from 'shared/stripe';
import { getCommunityById, setCommunityAnalytics } from '../models/community';

async function processJob(job: Job<StripeCommunityPaymentEventJobData>) {
  const { data: { communityId } } = job;

  debug(`Processing analytics added for ${communityId}`);

  if (!communityId) {
    debug(`No communityId ${communityId}`);
    return;
  }

  const {
    stripeCustomerId,
    administratorEmail,
    hasAnalytics,
    id,
    name,
  } = await getCommunityById(communityId);

  // if this job somehow mistakenly runs, we double check that in fact the community
  // does want analytics
  if (!hasAnalytics) {
    debug(`Community ${communityId} does not have analytics turned on, abort`);
  }

  // if no admin email exists, a user is likely trying to bypass our clientside
  // checks - in this case force shut off analytics
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
    const { id: createdStripeId } = await stripe.customers.create({
      email: administratorEmail,
      metadata: {
        communityId: id,
        communityName: name,
      },
    });

    // once the customer has been created, we can create the subscription
    // with analytics as the only subscriptionItem
    debug(
      `Creating a new subscription for the newly created customer ${communityId}`
    );
    return await stripe.subscriptions.create({
      customer: createdStripeId,
      billing_cycle_anchor: 1,
      items: [
        // NOTE: We have to include this dummy item in order to prevent
        // the top-level subscription from thinking it's about any
        // specific feature
        {
          plan: 'community-features',
          quantity: 1,
        },
        {
          plan: 'community-analytics',
          quantity: 1,
        },
      ],
    });
  }

  /*
    otherwise if a Stripe customer already exists, we need to:
    1. Check to see if an existing subscription exists
    1a. If yes, ensure that analytics isn't a subscription item
      1aa. If yes, abort
      1ab. Add a subscriptionItem for analytics
    1b. If no, create a new subscription
  */
  debug(`Getting customer subscriptions for ${communityId}`);
  const { subscriptions } = await stripe.customers.retrieve(stripeCustomerId);
  debug(`Got customer subscriptions for ${communityId}`);

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
        `Community ${communityId} already has an analytics subscription, abort`
      );
      return;
    }

    // 1ab
    debug(`Adding analytics subscriptionItem for customer ${communityId}`);
    return await stripe.subscriptionItems.create({
      subscription: subscriptionToEvaluate.id,
      plan: 'community-analytics',
      quantity: 1,
      prorate: true,
    });
  } else {
    // 1b
    debug(`Customer does not have an existing subscription ${communityId}`);
    return await stripe.subscriptions.create({
      customer: stripeCustomerId,
      billing_cycle_anchor: 1,
      items: [
        // NOTE: We have to include this dummy item in order to prevent
        // the top-level subscription from thinking it's about any
        // specific feature
        {
          plan: 'community-features',
          quantity: 1,
        },
        {
          plan: 'community-analytics',
          quantity: 1,
        },
      ],
    });
  }
}

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.log('❌', err);
    Raven.captureException(err);
  }
};
