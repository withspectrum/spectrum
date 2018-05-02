// @flow
require('now-env');
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const stripe = require('stripe')(STRIPE_TOKEN);

import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import {
  getUserRecurringPayments,
  updateRecurringPayment,
} from '../../models/recurringPayment';
import { deleteStripeSubscription } from './utils';
import { getCommunities } from '../../models/community';

type DowngradeCommunityInput = {
  input: {
    id: string,
  },
};

export default (
  _: any,
  { input }: DowngradeCommunityInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to create a community
  if (!currentUser) {
    return new UserError('You must be signed in to continue.');
  }

  // one async function to handle all downgrade logic
  const handleCommunityDowngrade = async () => {
    // get the current user's permissions in the community being downgraded
    const permissions = await getUserPermissionsInCommunity(
      input.id,
      currentUser.id
    );

    // get any recurringPayments records from the database matching this community
    const rPayments = await getUserRecurringPayments(currentUser.id);

    // if the current user doesn't own the community, break out
    if (!permissions.isOwner) {
      return new UserError(
        "You don't have permission to downgrade this community."
      );
    }

    // only evaluate community subscriptions, and not pro subscriptions
    const proSubscriptions =
      // if payments were found, make sure to select the first community-standard plan to update, otherwise return null and we will be creating a new payment
      rPayments &&
      rPayments
        .filter(pmt => pmt.communityId === input.id)
        .filter(pmt => pmt.planId === 'community-standard');

    const recurringPaymentToEvaluate =
      proSubscriptions && proSubscriptions.length > 0
        ? proSubscriptions[0]
        : null;

    // if no recurringPayments exist on the 'community-standard' plan, there is nothing to downgrade
    if (!recurringPaymentToEvaluate) {
      return new UserError(
        "We couldn't find a record of this community being upgraded."
      );
    }

    const customerId = recurringPaymentToEvaluate.customerId;
    const customer = await stripe.customers.retrieve(customerId);

    // if no customer could be found on stripe, we have no way to delete the right subscription
    if (!customer || !customer.id) {
      return new UserError("We couln't find a record of this subscription.");
    }

    // a customer record from stripe returns all of their subscriptions - we need to ensure we are only deleting the subscription for their community upgrade
    const subscriptionId = customer.subscriptions.data.filter(
      pmt => pmt.plan.id === 'community-standard'
    )[0].id;

    // delete the subscription
    const stripeData = await deleteStripeSubscription(subscriptionId);

    // update the recurringPayment record in the database to reflect the new canceled status
    return await updateRecurringPayment({
      id: recurringPaymentToEvaluate.id,
      stripeData: {
        ...stripeData,
        sourceBrand: customer.sources.data[0].brand,
        sourceLast4: customer.sources.data[0].last4,
      },
    });
  };

  // handle the entire downgrade flow
  return (
    handleCommunityDowngrade()
      // return the community to update the client side cache for isPro
      .then(() => getCommunities([input.id]))
      .then(communities => communities[0])
      .catch(err => {
        console.error('Error downgrading a community: ', err.message);
        return new UserError(
          "We weren't able to downgrade your community: " + err.message
        );
      })
  );
};
