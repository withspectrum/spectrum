// @flow
const debug = require('debug')('pluto:webhooks:index');
import { stripe, stripeWebhookSigningSecret } from 'shared/stripe';
import Raven from 'shared/raven';
import {
  stripeChargeEventQueue,
  stripeSubscriptionEventQueue,
  stripeSourceEventQueue,
  stripeCustomerEventQueue,
  stripeInvoiceEventQueue,
} from 'shared/bull/queues';

const WebhookHandler = {
  for: async (event: Object): Promise<any> => {
    const handler = {
      'charge.captured': stripeChargeEventQueue,
      'charge.failed': stripeChargeEventQueue,
      'charge.pending': stripeChargeEventQueue,
      'charge.refunded': stripeChargeEventQueue,
      'charge.succeeded': stripeChargeEventQueue,
      'charge.updated': stripeChargeEventQueue,

      'customer.created': stripeCustomerEventQueue,
      'customer.updated': stripeCustomerEventQueue,

      'customer.source.created': stripeSourceEventQueue,
      'customer.source.deleted': stripeSourceEventQueue,
      'customer.source.expiring': stripeSourceEventQueue,
      'customer.source.updated': stripeSourceEventQueue,

      'customer.subscription.created': stripeSubscriptionEventQueue,
      'customer.subscription.deleted': stripeSubscriptionEventQueue,
      'customer.subscription.updated': stripeSubscriptionEventQueue,

      'invoice.created': stripeInvoiceEventQueue,
      'invoice.updated': stripeInvoiceEventQueue,
      'invoice.payment_failed': stripeInvoiceEventQueue,
      'invoice.payment_succeeded': stripeInvoiceEventQueue,
    }[event.type];

    if (!handler || handler === undefined) {
      debug(`◽️  Unhandled event type: ${event.type}`);
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
      .add({ record: event.data.object })
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

  debug(`🕒 About to process event type ${event.type}`);

  return await WebhookHandler.for(event)
    .then(() => res.status(200).send('Webhook received: ' + event.id))
    // eslint-disable-next-line
    .catch(err => new Promise(resolve => Raven.captureException(err, resolve)));
};
