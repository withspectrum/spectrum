// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserRecurringPayments,
  updateRecurringPayment,
  createRecurringPayment,
} from '../../models/recurringPayment';
import {
  getStripeCustomer,
  createStripeCustomer,
  updateStripeCustomer,
  createStripeSubscription,
} from './utils';
import { getCommunities } from '../../models/community';
import { getMemberCount } from '../../models/community';

type UpgradeCommunityInput = {
  input: {
    plan: string,
    token: string,
    communityId: string,
  },
};

export default (
  _: any,
  args: UpgradeCommunityInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to create a community
  if (!currentUser) {
    return new UserError('You must be signed in to upgrade this community.');
  }

  // gql should have caught this, but just in case not token or plan
  // was specified, return an error
  if (!args.input.plan || !args.input.token) {
    return new UserError(
      'Something went wrong upgrading your community. Please try again.'
    );
  }

  const handleCommunityUpgrade = async () => {
    // parse the token string into an object
    let token = JSON.parse(args.input.token);
    const { input: { plan, communityId } } = args;

    // get the number of members in a community to determine the quantity of subscriptions to create, as well as retreive any existing recurringPayments records for this community to determine if the user is re-upgrading
    const memberCount = await getMemberCount(communityId);
    const rPayments = await getUserRecurringPayments(currentUser.id);

    // only evaluate community subscriptions, and not pro subscriptions
    const proSubscriptions =
      // if payments were found, make sure to select the first community-standard plan to update, otherwise return null and we will be creating a new payment
      rPayments &&
      rPayments
        .filter(pmt => pmt.communityId === communityId)
        .filter(pmt => pmt.planId === 'community-standard');

    const recurringPaymentToEvaluate =
      proSubscriptions && proSubscriptions.length > 0
        ? proSubscriptions[0]
        : null;

    // we still want to know globally if a user has a customerId already so that we avoid create duplicate customers in Stripe
    const hasCustomerId = (await rPayments) && rPayments.length > 0;

    // if the result is null, the user has never upgraded this community which means we need to create a stripe customer and then create the recurringPayment record in the database
    if (!recurringPaymentToEvaluate) {
      const customer = hasCustomerId
        ? await getStripeCustomer(rPayments[0].customerId)
        : await createStripeCustomer(currentUser.email, token.id);

      // create the subscription in stripe
      const subscription = await createStripeSubscription(
        customer.id,
        plan,
        Math.ceil(memberCount / 1000) // round up from the nearest 1,000 members
      );

      // create a recurringPayment record in the database
      return await createRecurringPayment({
        communityId,
        userId: currentUser.id,
        stripeData: {
          ...subscription,
          sourceBrand: customer.sources.data[0].brand,
          sourceLast4: customer.sources.data[0].last4,
        },
      });
    }

    if (recurringPaymentToEvaluate) {
      // if a result is returned, lets make sure that they don't
      // already have an active recurringPayment
      if (recurringPaymentToEvaluate.status === 'active') {
        return new UserError('This community is already upgraded - thank you!');
      }

      const customer = await updateStripeCustomer(
        recurringPaymentToEvaluate.customerId,
        currentUser.email,
        token.id
      );

      const subscription = await createStripeSubscription(
        customer.id,
        plan,
        Math.ceil(memberCount / 1000) // round up from the nearest 1,000 members
      );

      return await updateRecurringPayment({
        id: recurringPaymentToEvaluate.id,
        stripeData: {
          ...subscription,
          sourceBrand: customer.sources.data[0].brand,
          sourceLast4: customer.sources.data[0].last4,
        },
      });
    }
  };

  return handleCommunityUpgrade()
    .then(() => getCommunities([args.input.communityId]))
    .then(communities => communities[0])
    .catch(err => {
      console.log('Error upgrading a community: ', err.message);
      return new UserError(
        "We weren't able to upgrade your community: " + err.message
      );
    });
};
