// @flow
// $FlowFixMe
import UserError from '../utils/UserError';
// $FlowFixMe
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
// $FlowFixMe
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
// $FlowFixMe
const stripe = require('stripe')(STRIPE_TOKEN),
  currency = 'USD';
import {
  createRecurringPayment,
  updateRecurringPayment,
  getUserRecurringPayments,
} from '../models/recurringPayment';
import {
  getMembersInCommunity,
  getUserPermissionsInCommunity,
} from '../models/usersCommunities';
import { getCommunities } from '../models/community';
import { getUserById } from '../models/user';

const parseStripeErrors = err => {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return new UserError(err); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return new UserError(
        'Could not upgrade to Pro at this time, try again later: 1'
      );
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return new UserError(
        'Could not upgrade to Pro at this time, try again later: 2'
      );
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      return new UserError(
        'Something went wrong at Stripe, try again later: 3'
      );
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      return new UserError(
        'Something went wrong at Stripe, try again later: 4'
      );
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      return new UserError(
        'Something went wrong at Stripe, try again later: 5'
      );
      break;
    default:
      // Handle any other types of unexpected errors
      return new UserError('Something went wrong, try again later: 6');
      break;
  }
};

const getStripeCustomer = (customerId: string) => {
  try {
    return stripe.customers.retrieve(customerId);
  } catch (err) {
    return console.log(err) || err;
  }
};

const createStripeCustomer = (email: string, source: string) => {
  try {
    return stripe.customers.create({
      email,
      source,
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

const updateStripeCustomer = (customer, email, source) => {
  try {
    return stripe.customers.update(customer, {
      email,
      source,
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

const createStripeSubscription = (
  customer: string,
  plan: string,
  quantity: number
) => {
  try {
    return stripe.subscriptions.create({
      customer,
      items: [
        {
          plan,
          quantity: quantity ? quantity : 1, // if no quantity is provided, default to one
        },
      ],
    });
  } catch (err) {
    return console.log(err) || err;
  }
};

const deleteStripeSubscription = (subscription: string) => {
  try {
    return stripe.subscriptions.del(subscription);
  } catch (err) {
    return console.log(err) || err;
  }
};

type UpgradeToProArguments = {
  input: {
    plan: string,
    token: string,
  },
};

module.exports = {
  Mutation: {
    upgradeToPro: (_, args: UpgradeToProArguments, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError('You must be signed in to upgrade to Pro.');
      }

      // gql should have caught this, but just in case not token or plan
      // was specified, return an error
      if (!args.input.plan || !args.input.token) {
        return new UserError(
          'Something went wrong upgrading you to Pro. Please try again.'
        );
      }

      const handleProUpgrade = async () => {
        // parse the token string into an object
        let token = JSON.parse(args.input.token);
        const { input: { plan } } = args;

        // get any recurring payments for the current user
        const rPayments = await getUserRecurringPayments(currentUser.id);

        // only evaluate pro subscriptions, and not community subscriptions
        const proSubscriptions =
          // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
          rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');

        const recurringPaymentToEvaluate =
          proSubscriptions && proSubscriptions.length > 0
            ? proSubscriptions[0]
            : null;

        // we still want to know globally if a user has a customerId already so that we avoid create duplicate customers in Stripe
        const hasCustomerId = rPayments && rPayments.length > 0;

        // if no recurringPaymentToEvaluate is found, it means the user has never been pro and we can go ahead and create a new subscription
        if (!recurringPaymentToEvaluate) {
          const customer = hasCustomerId
            ? await getStripeCustomer(rPayments[0].customerId)
            : await createStripeCustomer(currentUser.email, token.id);

          const stripeData = await createStripeSubscription(
            customer.id,
            plan,
            1
          );
          return await createRecurringPayment({
            userId: currentUser.id,
            stripeData,
          });
        }

        if (recurringPaymentToEvaluate.status === 'active') {
          return new UserError("You're already a Pro member - thank you!");
        }

        if (recurringPaymentToEvaluate) {
          const customer = await updateStripeCustomer(
            recurringPaymentToEvaluate.customerId,
            currentUser.email,
            token.id
          );

          const subscription = await createStripeSubscription(
            customer.id,
            plan,
            1
          );

          return await updateRecurringPayment({
            id: recurringPaymentToEvaluate.id,
            stripeData: subscription,
          });
        }
      };

      // handle pro upgrade logic
      return (
        handleProUpgrade()
          // return the user record to update the cilent side cache for isPro
          .then(() => getUserById(currentUser.id))
          .catch(err => {
            console.log('Error upgrading to Pro: ', err.message);
            return new UserError(
              "We weren't able to upgrade you to Pro: " + err.message
            );
          })
      );
    },
    downgradeFromPro: (_, __, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError(
          'You must be signed in to cancel your Pro subscription.'
        );
      }

      const handleProDowngrade = async () => {
        // get any recurring payments for the current user
        const rPayments = await getUserRecurringPayments(currentUser.id);

        // only evaluate pro subscriptions, and not community subscriptions
        const proSubscriptions =
          // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
          rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');

        const recurringPaymentToEvaluate =
          proSubscriptions && proSubscriptions.length > 0
            ? proSubscriptions[0]
            : null;

        // if the result is null, we don't have a record of the recurringPayment
        if (!recurringPaymentToEvaluate) {
          return new UserError(
            "We couldn't find a record of a Pro subscription."
          );
        }

        const customerId = recurringPaymentToEvaluate.customerId;
        const customer = await getStripeCustomer(customerId);

        // if we can't find a customer record on stripe, we will have nobody to downgrade
        if (!customer || !customer.id) {
          return new UserError(
            "We couldn't find a record of this subscription."
          );
        }

        // a customer record from stripe returns all of their subscriptions - we need to ensure we are only deleting the subscription for Pro
        const subscriptionId = customer.subscriptions.data.filter(
          pmt => pmt.plan.id === 'beta-pro'
        )[0].id;

        // delete the subscription on stripe
        const stripeData = await deleteStripeSubscription(subscriptionId);

        // update the recurringPayment record in the database
        return await updateRecurringPayment({
          id: recurringPaymentToEvaluate.id,
          stripeData,
        });
      };

      // handle all downgrade logic and then return the user record to the client to bust the isPro cache
      return handleProDowngrade()
        .then(() => getUserById(currentUser.id))
        .catch(err => {
          console.log('Error downgrading from Pro: ', err.message);
          return new UserError(
            "We weren't able to cancel your subsciption: " + err.message
          );
        });
    },
    upgradeCommunity: (_, args, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError(
          'You must be signed in to upgrade this community.'
        );
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
        const members = await getMembersInCommunity(communityId);
        const rPayments = await getUserRecurringPayments(currentUser.id);

        // only evaluate community subscriptions, and not pro subscriptions
        const proSubscriptions =
          // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
          rPayments &&
          rPayments
            .filter(pmt => pmt.communityId === communityId)
            .filter(pmt => pmt.planId === 'community-pro');

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
            Math.ceil(members.length / 1000) // round up from the nearest 1,000 members
          );

          // create a recurringPayment record in the database
          return await createRecurringPayment({
            communityId,
            userId: currentUser.id,
            stripeData: subscription,
          });
        }

        if (recurringPaymentToEvaluate) {
          // if a result is returned, lets make sure that they don't
          // already have an active recurringPayment
          if (recurringPaymentToEvaluate.status === 'active') {
            return new UserError(
              'This community is already upgraded - thank you!'
            );
          }

          const customer = await updateStripeCustomer(
            recurringPaymentToEvaluate.customerId,
            currentUser.email,
            token.id
          );

          const subscription = await createStripeSubscription(
            customer.id,
            plan,
            Math.ceil(members.length / 1000) // round up from the nearest 1,000 members
          );

          return await updateRecurringPayment({
            id: recurringPaymentToEvaluate.id,
            stripeData: subscription,
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
    },
    downgradeCommunity: (_, { input }, { user }) => {
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
          // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
          rPayments &&
          rPayments
            .filter(pmt => pmt.communityId === input.id)
            .filter(pmt => pmt.planId === 'community-pro');

        const recurringPaymentToEvaluate =
          proSubscriptions && proSubscriptions.length > 0
            ? proSubscriptions[0]
            : null;

        // if no recurringPayments exist on the 'community-pro' plan, there is nothing to downgrade
        if (!recurringPaymentToEvaluate) {
          return new UserError(
            "We couldn't find a record of this community being upgraded."
          );
        }

        const customerId = recurringPaymentToEvaluate.customerId;
        const customer = await stripe.customers.retrieve(customerId);

        // if no customer could be found on stripe, we have no way to delete the right subscription
        if (!customer || !customer.id) {
          return new UserError(
            "We couln't find a record of this subscription."
          );
        }

        // a customer record from stripe returns all of their subscriptions - we need to ensure we are only deleting the subscription for their community upgrade
        const subscriptionId = customer.subscriptions.data.filter(
          pmt => pmt.plan.id === 'community-pro'
        )[0].id;

        // delete the subscription
        const stripeData = await deleteStripeSubscription(subscriptionId);

        // update the recurringPayment record in the database to reflect the new canceled status
        return await updateRecurringPayment({
          id: recurringPaymentToEvaluate.id,
          stripeData,
        });
      };

      // handle the entire downgrade flow
      return (
        handleCommunityDowngrade()
          // return the community to update the client side cache for isPro
          .then(() => getCommunities([input.id]))
          .then(communities => communities[0])
          .catch(err => {
            console.log('Error downgrading a community: ', err.message);
            return new UserError(
              "We weren't able to downgrade your community: " + err.message
            );
          })
      );
    },
  },
};
