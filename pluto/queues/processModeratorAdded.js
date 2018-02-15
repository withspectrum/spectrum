// @flow
import type {
  Job,
  StripeCommunityPaymentEventJobData,
} from 'shared/bull/types';

export default async (job: Job<StripeCommunityPaymentEventJobData>) => {};

// /*

//     At this point we know the user has a stripe customer created
//     We need to know the following:

//     1. Do they have a chargeable source on file?
//     2. Do they have an active subscription already?
//     3. If they have an active subscription, do they have a subscription item for
//        moderator seats?

//     1a. If they don't have a chargeable source, this fails and we push them to the billing page
//     1b. If they have a chargeable source, continue

//     2a. If they don't have an active subscription, we will create a new subscription (this is their first payment event!)
//     2b. If they have an active subscription, continue

//     3a. If they already have an active subscription, and they don't have a subscription item for moderator seats, we will add a new
//         subscription item to their existing subscription
//     3b. If they have an active subscription and they have a subscription item for moderator seats, we will increment the count on the
//         subscription item
//   */

//  const customer = await getStripeCustomer(stripeCustomerId);

//  if (!customer) {
//    return new UserError('No customer created yet somehow...');
//  }

//  const sources = customer.sources.data;
//  const subscriptions = customer.subscriptions.data;

//  // 1
//  if (
//    !sources ||
//    sources.length === 0 ||
//    !sources.some(source => source.status === 'chargeable')
//  ) {
//    // 1a
//    return new UserError(
//      'You must have a valid payment method for this community to add new moderators'
//    );
//  }

//  // 2
//  if (!subscriptions || subscriptions.length === 0) {
//    // 2a
//    stripe.subscriptions.create({
//      customer: stripeCustomerId,
//      billing_cycle_anchor: 1,
//      items: [
//        // NOTE: We have to include this dummy item in order to prevent
//        // the top-level subscription from thinking it's about any
//        // specific feature
//        {
//          plan: 'community-features',
//          quantity: 1,
//        },
//        {
//          plan: 'moderator-seat',
//          quantity: 1,
//        },
//      ],
//    });
//  }

//  // 3
//  if (subscriptions && subscriptions.length > 0) {
//    const subscriptionToEvaluate = subscriptions[0];
//    const hasModeratorSeatItem = subscriptionToEvaluate.items.data.some(
//      sub => sub.plan.id === 'moderator-seat'
//    );

//    if (!hasModeratorSeatItem) {
//      // 3a
//      stripe.subscriptionItems.create({
//        subscription: subscriptionToEvaluate.subscriptionId,
//        plan: 'moderator-seat',
//        quantity: 1,
//        prorate: true,
//      });
//    } else {
//      // 3b
//      const subscriptionItem = subscriptionToEvaluate.items.data
//        .filter(sub => sub.plan.id === 'moderator-seat')[0];

//      stripe.subscriptionItems.update(
//        subscriptionItem.id,
//        {
//          prorate: true,
//          quantity: subscriptionItem.quantity + 1,
//        }
//      );
//    }
//  }
