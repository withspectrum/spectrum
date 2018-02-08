// @flow
require('now-env');
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const STRIPE_WEBHOOK_SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
const stripe = require('stripe')(STRIPE_TOKEN);
const endpointSecret = STRIPE_WEBHOOK_SIGNING_SECRET;
import Raven from 'shared/raven';

import { CustomerEventHandler } from './customerEvent';
import { SourceEventHandler } from './sourceEvent';
import { SubscriptionEventHandler } from './subscriptionEvent';
import { InvoiceEventHandler } from './invoiceEvent';

const WebhookHandler = {
  for: async (event: Object): Promise<any> => {
    const handler = {
      // 'customer.created': CustomerEventHandler,
      // 'customer.updated': CustomerEventHandler,
      // 'customer.source.created': CustomerSourceCreatedHandler,
      // 'customer.source.deleted': CustomerSourceDeletedHandler,
      // 'customer.source.expiring': CustomerSourceExpiringHandler,
      // 'customer.source.updated': SourceEventHandler,
      // 'customer.subscription.created': SubscriptionEventHandler,
      // 'customer.subscription.deleted': SubscriptionEventHandler,
      // 'customer.subscription.updated': CustomerSubscriptionUpdatedHandler,
      'invoice.created': InvoiceEventHandler,
      // 'invoice.payment_failed': InvoicePaymentFailedHandler,
      'invoice.payment_succeeded': InvoiceEventHandler,
    }[event.type];

    if (!handler || handler === undefined) {
      console.log(`❌  Unhandled event type: ${event.type}`);
      return;
      // throw new Error(`Unhandled event type: ${event.type}`);
    }

    console.log('✅ Got event handler for:', event.type, event.data.object.id);
    return await handler.handle(event).catch(err => new Error(err));
  },
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
      console.log('❌ No event found!');
    } catch (err) {
      console.error('❌ Raven error', err);
    }
  }

  console.log('🕒 About to process event:', event.type);

  return (
    WebhookHandler.for(event)
      .then(() => res.status(200).send('Webhook received: ' + event.id))
      // eslint-disable-next-line
      .catch(
        err => new Promise(resolve => Raven.captureException(err, resolve))
      )
  );
};
