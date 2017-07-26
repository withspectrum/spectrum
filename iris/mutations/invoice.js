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

import { payInvoice, getInvoice } from '../models/invoice';

const parseStripeErrors = err => {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return new UserError(err); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return new UserError(
        'Could not pay this invoice at this time, try again later'
      );
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return new UserError(
        'Could not pay this invoice at this time, try again later'
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
    payInvoice: (_, { input }, { user }) => {
      const currentUser = user;

      // user must be authed to create a community
      if (!currentUser) {
        return new UserError('You must be signed in to pay an invoice.');
      }

      // gql should have caught this, but just in case not token or plan
      // was specified, return an error
      if (!input.id || !input.token) {
        return new UserError(
          "We aren't able to process this invoice right now. Try again soon."
        );
      }

      // parse the token string into an object
      let token = JSON.parse(input.token);

      return getInvoice(input.id).then(invoice => {
        if (invoice.paidAt || invoice.stripeData) {
          return new UserError('This invoice has already been paid.');
        }

        return (
          stripe.charges
            .create({
              amount: invoice.amount,
              currency: 'usd',
              source: token.id,
              description: invoice.note,
            })
            // creat the recurringPayment object
            .then(charge => payInvoice(invoice.id, charge))
            .catch(err => {
              console.log(err, err.message);
              return parseStripeErrors(err);
            })
        );
      });
    },
  },
};
