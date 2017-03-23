'use strict';

const functions = require('firebase-functions'),
  admin = require('firebase-admin');

const stripe = require('stripe')(functions.config().stripe.test_token),
  currency = functions.config().stripe.currency || 'USD';

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeSubscription = functions.database
  .ref('/users_private/{userId}/subscription')
  .onWrite(event => {
    const val = event.data.val();

    // if no token was sent, return
    if (val === null) return null;

    /*
   * successful val looks like this:

    { card:
      { brand: 'Visa',
        country: 'US',
        cvc_check: 'pass',
        exp_month: 12,
        exp_year: 2034,
        funding: 'credit',
        id: 'card_19zxRSLMElznt8M8CWi0Yw81',
        last4: '4242',
        name: 'briandlovin@gmail.com',
        object: 'card'
      },
      client_ip: '136.24.34.93',
      created: 1490142911,
      email: 'briandlovin@gmail.com',
      id: 'tok_19zxRTLMElznt8M89YBIaE45',
      livemode: false,
      object: 'token',
      type: 'card',
      used: false
    }

  */

    // create a customer with the credit card sent down from the client
    return stripe.customers
      .create({
        email: val.email,
        source: val.id,
      })
      .then(customer => {
        /*
     * customer looks like this:

      customer {
        id: 'cus_AKd963x8h8WQvb',
        object: 'customer',
        account_balance: 0,
        created: 1490144626,
        currency: null,
        default_source: 'card_19zxt1LMElznt8M8ZaWa9Fev',
        delinquent: false,
        description: null,
        discount: null,
        email: 'briandlovin@gmail.com',
        livemode: false,
        metadata: {},
        shipping: null,
        sources:
        { object: 'list',
           data: [ [Object] ],
           has_more: false,
           total_count: 1,
           url: '/v1/customers/cus_AKd963x8h8WQvb/sources'
        },
        subscriptions:
         { object: 'list',
           data: [],
           has_more: false,
           total_count: 0,
           url: '/v1/customers/cus_AKd963x8h8WQvb/subscriptions'
         }
        }

    */

        // once we have the customer, write their customerId to the db
        return admin
          .database()
          .ref(`/users_private/${event.params.userId}`)
          .update({ customerId: customer.id })
          .then(() => {
            // once the customer is safely written, create a subscription
            stripe.subscriptions
              .create({
                plan: 'beta-pro',
                customer: customer.id,
              })
              .then(subscription => {
                return admin
                  .database()
                  .ref(`/users_private/${event.params.userId}`)
                  .update({
                    status: {
                      subscriptionId: subscription.id,
                      active: true,
                      error: null, // when successful, clear out any errors on the status because errors get passed back and rendered on the client
                      /*
            * when a user downgrades in the future, we will set this active field to 'false'
            * using another cloud function, we will listen to writes on the 'active' field which
            * will trigger a subscription cancellation on Stripe
            */
                    },
                  });
              })
              .catch(error => {
                if (!error) return;
                const errorMessage = userFacingMessage(error);
                return admin
                  .database()
                  .ref(`/users_private/${event.params.userId}/status`)
                  .update({
                    error: errorMessage,
                  });
              });
          });
      });
  });

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}
