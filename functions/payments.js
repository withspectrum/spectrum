const functions = require('firebase-functions'),
  admin = require('firebase-admin');

const stripe = require('stripe')(functions.config().stripe.test_token),
  currency = functions.config().stripe.currency || 'USD';

const cors = require('cors');

const express = require('express');
const app = express();
app.use(cors());

app.post('/subscriptions/create', (req, res) => {
  const token = JSON.parse(req.body.token);
  const plan = req.body.plan;

  if (!token) return res.json({ success: false, error: 'No token detected' });
  // create a customer with the credit card sent down from the client
  stripe.customers.create(
    {
      email: token.email,
      source: token.id,
    },
    (err, customer) => {
      if (err) returnError(res, err);

      // after the customer is created, charge them and put them on the subscription
      stripe.subscriptions.create(
        {
          plan: plan,
          customer: customer.id,
        },
        (err, subscription) => {
          // unable to create the subscription
          if (err) returnError(res, err);

          // send back a response once we know the customer and subscription worked
          return res.json({
            success: true,
            customerId: customer.id,
            customerEmail: token.email,
            subscriptionId: subscription.id,
            tokenId: token.id,
          });
        },
      );
    },
  );
});

// Case and return the proper error to the client
returnError = function(res, err) {
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      return res.json({ success: false, error: err.message }); // => e.g. "Your card's expiration year is invalid."
      break;
    case 'RateLimitError':
      // Too many requests made to the API too quickly
      return res.json({ success: false });
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      return res.json({ success: false });
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
    default:
      // Handle any other types of unexpected errors
      return res.json({
        success: false,
        error: "We weren't able to process your payment at this time.",
      });
      break;
  }
};

module.exports = functions.https.onRequest(app);
