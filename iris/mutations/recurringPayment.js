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
  getCommunityRecurringPayments,
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

async function createStripeCustomer(email: string, source: string) {
  return await stripe.customers.create({
    email,
    source,
  });
}

async function updateStripeCustomer(customer, email, source) {
  return await stripe.customers.update(customer, {
    email,
    source,
  });
}

async function createStripeSubscription(
  customer: string,
  plan: string,
  quantity: number
) {
  return await stripe.subscriptions.create({
    customer,
    items: [
      {
        plan,
        quantity: quantity ? quantity : 1, // if no quantity is provided, default to one
      },
    ],
  });
}

async function deleteStripeSubscription(subscription: string) {
  return await stripe.subscriptions.del(subscription);
}

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

      // parse the token string into an object
      let token = JSON.parse(args.input.token);
      const { input: { plan } } = args;

      // determine if this user has been a pro member before by seeing if
      // they have a recurringPayment recrod in the db
      return (
        getUserRecurringPayments(currentUser.id)
          .then(rPayments => {
            const proSubscriptions =
              rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');
            const recurringPaymentToEvaluate =
              proSubscriptions.length > 0 ? proSubscriptions[0] : null;

            // if the result is null, the user has never been a pro user
            // which means we need to create a stripe customer and then
            // create the recurringPayment
            if (!recurringPaymentToEvaluate) {
              // create a customer in stripe
              return (
                createStripeCustomer(currentUser.email, token.id)
                  // creat the recurringPayment object
                  .then(customer =>
                    createStripeSubscription(customer.id, plan, 1)
                  )
                  // store a new record in the recurringPayments table
                  .then(stripeData =>
                    createRecurringPayment({
                      userId: currentUser.id,
                      stripeData,
                    })
                  )
              );
            } else {
              // if a result is returned, lets make sure that they don't
              // already have an active recurringPayment
              if (recurringPaymentToEvaluate.status === 'active') {
                return new UserError(
                  "You're already a Pro member - thank you!"
                );
              } else {
                // if a result exists, and it is not active, it means
                // the user was previously pro and is upgrading again. this means
                // we can just update their stripe customer with the new
                // payment method and renew the recurringPayment

                // update the customer, keeping the email up to date and adding
                // a newly updated source
                return (
                  updateStripeCustomer(
                    recurringPaymentToEvaluate.customerId,
                    currentUser.email,
                    token.id
                  )
                    // then create a new subscription
                    .then(customer =>
                      createStripeSubscription(customer.id, plan, 1)
                    )
                    // update the recurring payment record in the database
                    .then(stripeData =>
                      updateRecurringPayment({
                        id: recurringPaymentToEvaluate.id,
                        stripeData,
                      })
                    )
                );
              }
            }
          })
          // return the user record to update the cilent side cache for isPro
          .then(() => getUserById(currentUser.id))
          .catch(
            err => console.log('error: ', err.message) || parseStripeErrors(err)
          )
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

      // determine if this user has been a pro member before by seeing if
      // they have a recurringPayment record in the db
      return getUserRecurringPayments(currentUser.id)
        .then(result => {
          const proSubscriptions =
            rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');
          const recurringPaymentToEvaluate =
            proSubscriptions.length > 0 ? proSubscriptions[0] : null;

          // if the result is null, we don't have a record of the recurringPayment
          if (!recurringPaymentToEvaluate) {
            return new UserError(
              "We couldn't find a record of a Pro subscription."
            );
          }

          const customerId = recurringPaymentToEvaluate.customerId;

          // delete the recurringPayment
          return stripe.customers.retrieve(customerId).then(customer => {
            if (!customer || !customer.id) {
              return new UserError(
                "We couldn't find a record of this subscription."
              );
            }

            const subscriptionId = customer.subscriptions.data.filter(
              pmt => pmt.plan.id === 'beta-pro'
            )[0].id;

            return (
              deleteStripeSubscription(subscriptionId)
                // update the record in the database
                .then(stripeData =>
                  updateRecurringPayment({
                    id: recurringPaymentToEvaluate.id,
                    stripeData,
                  })
                )
            );
          });
        })
        .then(() => getUserById(currentUser.id))
        .catch(
          err => console.log('error: ', err.message) || parseStripeErrors(err)
        );
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

      // parse the token string into an object
      let token = JSON.parse(args.input.token);
      const { input: { plan, communityId } } = args;

      // get the number of members in a community to determine the quantity of subscriptions to create, as well as retreive any existing recurringPayments records for this community to determine if the user is re-upgrading
      async function getCommunityInfo() {
        const members = await getMembersInCommunity(communityId);
        const rPayments = await getCommunityRecurringPayments(communityId);
        return { members, rPayments };
      }

      return (
        getCommunityInfo()
          .then(({ members, rPayments }) => {
            const recurringPaymentToEvaluate =
              // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
              rPayments
                ? // we will evaluate the first returned recurring payment where the plan is community-pro. In theory a community should never have more than one of these records, so we instantly select the first record
                  rPayments.filter(pmt => pmt.planId === 'community-pro')[0]
                : null;

            // if the result is null, the user has never upgraded this community which means we need to create a stripe customer and then create the recurringPayment record in the database
            if (!recurringPaymentToEvaluate) {
              // create a customer in stripe
              return (
                createStripeCustomer(currentUser.email, token.id)
                  // creat the subscription
                  .then(customer =>
                    createStripeSubscription(
                      customer.id,
                      plan,
                      Math.ceil(members.length / 1000) // round up from the nearest 1,000 members
                    )
                      // store a new record in the recurringPayments table
                      .then(stripeData =>
                        createRecurringPayment({
                          communityId,
                          userId: currentUser.id,
                          stripeData,
                        })
                      )
                  )
              );
            } else {
              // if a result is returned, lets make sure that they don't
              // already have an active recurringPayment
              if (recurringPaymentToEvaluate.status === 'active') {
                return new UserError(
                  'This community is already upgraded - thank you!'
                );
              } else {
                // if a result exists, and it is not active, it means the user was previously pro and is upgrading the community again. This means we can just update their stripe customer with the new payment method and renew the recurringPayment

                // update the customer, keeping the email up to date and adding a newly updated source
                return (
                  updateStripeCustomer(
                    recurringPaymentToEvaluate.customerId,
                    currentUser.email,
                    token.id
                  )
                    // then create a new recurringPayment
                    .then(customer =>
                      createStripeSubscription(
                        customer.id,
                        plan,
                        Math.ceil(members.length / 1000) // round up from the nearest 1,000 members
                      )
                        // update the record in the database
                        .then(stripeData =>
                          updateRecurringPayment({
                            id: recurringPaymentToEvaluate.id,
                            stripeData,
                          })
                        )
                    )
                );
              }
            }
          })
          // return the community record to update the client side cache for isPro
          .then(() => getCommunities([communityId]))
          .then(communities => communities[0])
          .catch(
            err => console.log('error: ', err.message) || parseStripeErrors(err)
          )
      );
    },
    downgradeCommunity: (_, { input: { id } }, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      // get the recurring payment to cancel as well as the community permission for the user to make sure they are an owner and are allowed to downgrade
      async function getCommunityInfo() {
        const permissions = await getUserPermissionsInCommunity(
          id,
          currentUser.id
        );
        const rPayments = await getCommunityRecurringPayments(id);
        return { permissions, rPayments };
      }

      // fetch the recurring payment to cancel
      return getCommunityInfo()
        .then(({ permissions, rPayments }) => {
          // if the user doesn't own the community they can't downgrade the community
          if (!permissions.isOwner) {
            return new UserError(
              "You don't have permission to downgrade this community."
            );
          }

          const recurringPaymentToEvaluate =
            // if payments were found, make sure to select the first community-pro plan to update, otherwise return null and we will be creating a new payment
            rPayments
              ? // we will evaluate the first returned recurring payment where the plan is community-pro. In theory a community should never have more than one of these records, so we instantly select the first record
                rPayments.filter(pmt => pmt.planId === 'community-pro')[0]
              : null;

          // if the result is null, we don't have a record of the recurringPayment
          if (!recurringPaymentToEvaluate) {
            return new UserError(
              "We couldn't find a record of this community being upgraded."
            );
          }

          const customerId = recurringPaymentToEvaluate.customerId;

          // delete the recurringPayment
          return (
            stripe.customers
              .retrieve(customerId)
              .then(customer => {
                if (!customer || !customer.id) {
                  return new UserError(
                    "We couln't find a record of this subscription."
                  );
                }

                const subscriptionId = customer.subscriptions.data.filter(
                  pmt => pmt.plan.id === 'community-pro'
                )[0].id;

                return (
                  deleteStripeSubscription(subscriptionId)
                    // update the record in the database
                    .then(stripeData =>
                      updateRecurringPayment({
                        id: recurringPaymentToEvaluate.id,
                        stripeData,
                      })
                    )
                );
              })
              // return the community to update the client side cache for isPro
              .then(() => getCommunities([id]))
              .then(communities => communities[0])
          );
        })
        .catch(
          err => console.log('error: ', err.message) || parseStripeErrors(err)
        );
    },
  },
};
