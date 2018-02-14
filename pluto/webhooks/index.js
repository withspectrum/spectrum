// @flow
const debug = require('debug')('pluto:webhooks:index');
import { stripe, stripeWebhookSigningSecret } from 'shared/stripe';
import Raven from 'shared/raven';

import { CustomerEventHandler } from './customerEvent';
import { SourceEventHandler } from './sourceEvent';
import { SubscriptionEventHandler } from './subscriptionEvent';
import { InvoiceEventHandler } from './invoiceEvent';

const WebhookHandler = {
  for: async (event: Object): Promise<any> => {
    const handler = {
      'customer.created': CustomerEventHandler,
      'customer.updated': CustomerEventHandler,
      'customer.source.created': SourceEventHandler,
      'customer.source.deleted': SourceEventHandler,
      'customer.source.expiring': SourceEventHandler,
      'customer.source.updated': SourceEventHandler,
      'customer.subscription.created': SubscriptionEventHandler,
      'customer.subscription.deleted': SubscriptionEventHandler,
      'customer.subscription.updated': SubscriptionEventHandler,
      'invoice.created': InvoiceEventHandler,
      'invoice.payment_failed': InvoiceEventHandler,
      'invoice.payment_succeeded': InvoiceEventHandler,
    }[event.type];

    if (!handler || handler === undefined) {
      debug(`❌  Unhandled event type: ${event.type}`);
      return;
      // throw new Error(`Unhandled event type: ${event.type}`);
    }

    debug(
      '\n\n✅ Got event handler for:',
      event.type,
      event.data.object.id,
      '\n\n'
    );
    return await handler
      .handle(event)
      .then(() => {
        debug(
          `\n\n😈 JOB FINISHED for ${event.type} ${event.data.object.id}\n\n`
        );
        return;
      })
      .catch(err => new Error(err));
  },
};

export const handleWebhooks = async (req: any, res: any) => {
  // in production, verify stripe event signatures
  let event;
  if (process.env.NODE_ENV === 'production') {
    let sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeWebhookSigningSecret
    );
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

  return await WebhookHandler.for(event)
    .then(() => res.status(200).send('Webhook received: ' + event.id))
    // eslint-disable-next-line
    .catch(err => new Promise(resolve => Raven.captureException(err, resolve)));
};
