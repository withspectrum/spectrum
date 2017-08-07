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

const stripe = require('stripe')(STRIPE_TOKEN),
  currency = 'USD';

import {
  createRecurringPayment,
  updateRecurringPayment,
  getUserRecurringPayments,
} from '../models/recurringPayment';

type UpgradeToProArguments = {
  input: {
    plan: string,
    token: string,
  },
};

const parseStripeErrors = err => {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return new UserError(err); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return new UserError(
        'Could not upgrade to Pro at this time, try again later'
      );
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return new UserError(
        'Could not upgrade to Pro at this time, try again later'
      );
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      return new UserError('Something went wrong at Stripe, try again later');
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      return new UserError('Something went wrong at Stripe, try again later');
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      return new UserError('Something went wrong at Stripe, try again later');
      break;
    default:
      // Handle any other types of unexpected errors
      return new UserError('Something went wrong, try again later');
      break;
  }
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
      return getUserRecurringPayments(currentUser.id)
        .then(result => {
          const recurringPaymentToEvaluate =
            result && result.length > 0 ? result[0] : null;
          // if the result is null, the user has never been a pro user
          // which means we need to create a stripe customer and then
          // create the recurringPayment
          if (recurringPaymentToEvaluate === null) {
            // create a customer in stripe
            return (
              stripe.customers
                .create({
                  email: currentUser.email,
                  source: token.id,
                })
                // creat the recurringPayment object
                .then(customer =>
                  stripe.subscriptions.create({
                    plan,
                    customer: customer.id,
                  })
                )
                // store a new record in the recurringPayments table
                .then(recurringPayment =>
                  createRecurringPayment(currentUser.id, recurringPayment)
                )
            );
          } else {
            // if a result is returned, lets make sure that they don't
            // already have an active recurringPayment
            if (recurringPaymentToEvaluate.stripeData.status === 'active') {
              return new UserError("You're already a Pro member - thanks!");
            } else {
              // if a result exists, and it is not active, it means
              // the user was previously pro and is upgrading again. this means
              // we can just update their stripe customer with the new
              // payment method and renew the recurringPayment

              // update the customer, keeping the email up to date and adding
              // a newly updated source
              return (
                stripe.customers
                  .update(recurringPaymentToEvaluate.stripeData.customer, {
                    email: currentUser.email,
                    source: token.id,
                  })
                  // then create a new recurringPayment
                  .then(customer =>
                    stripe.subscriptions.create({
                      plan,
                      customer: customer.id,
                    })
                  )
                  // update the record in the database
                  .then(recurringPayment =>
                    updateRecurringPayment(
                      recurringPaymentToEvaluate.id,
                      recurringPayment
                    )
                  )
              );
            }
          }
        })
        .catch(
          err => console.log('error: ', err.message) || parseStripeErrors(err)
        );
    },
    downgradeFromPro: (_, __, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError(
          'You must be signed in to cancel your Pro recurringPayment.'
        );
      }

      // determine if this user has been a pro member before by seeing if
      // they have a recurringPayment record in the db
      return getUserRecurringPayments(currentUser.id)
        .then(result => {
          const recurringPaymentToEvaluate =
            result && result.length > 0 ? result[0] : null;

          // if the result is null, we don't have a record of the recurringPayment
          if (recurringPaymentToEvaluate === null) {
            return new UserError(
              "We couldn't find a record of a Pro subscription."
            );
          }

          const customerId = recurringPaymentToEvaluate.stripeData.customer;

          // delete the recurringPayment
          return stripe.customers.retrieve(customerId).then(customer => {
            if (!customer || !customer.id) {
              return new UserError(
                "We couln't find a record of this subscription."
              );
            }

            const subscriptionId = customer.subscriptions.data[0].id;

            return (
              stripe.subscriptions
                .del(subscriptionId)
                // update the record in the database
                .then(recurringPayment =>
                  updateRecurringPayment(
                    recurringPaymentToEvaluate.id,
                    recurringPayment
                  )
                )
            );
          });
        })
        .catch(
          err => console.log('error: ', err.message) || parseStripeErrors(err)
        );
    },
  },
};
