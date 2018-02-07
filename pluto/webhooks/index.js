// @flow
require('now-env');
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const STRIPE_WEBHOOK_SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
const stripe = require('stripe')(STRIPE_TOKEN);
const endpointSecret = STRIPE_WEBHOOK_SIGNING_SECRET;
import Raven from 'shared/raven';
import { CustomerCreatedHandler } from './customerCreatedHandler';

const WebhookHandler = {};
WebhookHandler.for = event => {
  const handler = {
    'customer.created': CustomerCreatedHandler,
    // 'customer.updated': CustomerUpdatedHandler,
    // 'customer.source.created': CustomerSourceCreatedHandler,
    // 'customer.source.deleted': CustomerSourceDeletedHandler,
    // 'customer.source.expiring': CustomerSourceExpiringHandler,
    // 'customer.source.updated': CustomerSourceUpdatedHandler,
    // 'customer.subscription.created': CustomerSubscriptionCreatedHandler,
    // 'customer.subscription.deleted': CustomerSubscriptionDeletedHandler,
    // 'customer.subscription.updated': CustomerSubscriptionUpdatedHandler,
    // 'invoice.created': InvoiceCreatedHandler,
    // 'invoice.payment_failed': InvoicePaymentFailedHandler,
    // 'invoice.payment_succeeded': InvoicePaymentSucceededHandler,
    // 'invoice.updated': InvoiceUpdatedHandler,
  }[event.type];

  if (!handler) {
    throw new Error(`Unhandled event type: ${event.type}`);
  }

  return handler;
};

export const handleWebhooks = (req: any, res: any) => {
  // in production, verify stripe event signatures
  let event;
  if (process.env.NODE_ENV === 'production') {
    let sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } else {
    event = JSON.parse(req.body);
  }

  // if signature isn't verifiable or if event can't be parsed
  if (!event) {
    try {
      console.log('No event found!');
      return new Promise(resolve => Raven.captureException(err, resolve));
    } catch (err) {
      console.error('Raven error', err);
    }
  }

  return WebhookHandler.for(event)
    .handle(event)
    .then(() => res.status(200).send('Webhook received: ' + event.id))
    .catch(err => new Promise(resolve => Raven.captureException(err, resolve)));
};
