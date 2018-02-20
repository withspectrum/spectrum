// @flow
const debug = require('debug')('pluto:webhooks:index');
import { stripe, stripeWebhookSigningSecret } from 'shared/stripe';
import Raven from 'shared/raven';
import {
  stripeChargeWebhookEventQueue,
  stripeSubscriptionWebhookEventQueue,
  stripeSourceWebhookEventQueue,
  stripeCustomerWebhookEventQueue,
  stripeInvoiceWebhookEventQueue,
  stripeDiscountWebhookEventQueue,
} from 'shared/bull/queues';

const WebhookHandler = {
  for: async (event: Object): Promise<any> => {
    const handler = {
      'charge.captured': stripeChargeWebhookEventQueue,
      'charge.failed': stripeChargeWebhookEventQueue,
      'charge.pending': stripeChargeWebhookEventQueue,
      'charge.refunded': stripeChargeWebhookEventQueue,
      'charge.succeeded': stripeChargeWebhookEventQueue,
      'charge.updated': stripeChargeWebhookEventQueue,

      'customer.created': stripeCustomerWebhookEventQueue,
      'customer.updated': stripeCustomerWebhookEventQueue,

      'customer.source.created': stripeSourceWebhookEventQueue,
      'customer.source.deleted': stripeSourceWebhookEventQueue,
      'customer.source.expiring': stripeSourceWebhookEventQueue,
      'customer.source.updated': stripeSourceWebhookEventQueue,

      'customer.subscription.created': stripeSubscriptionWebhookEventQueue,
      'customer.subscription.deleted': stripeSubscriptionWebhookEventQueue,
      'customer.subscription.updated': stripeSubscriptionWebhookEventQueue,

      'customer.discount.updated': stripeDiscountWebhookEventQueue,
      'customer.discount.created': stripeDiscountWebhookEventQueue,
      'customer.discount.deleted': stripeDiscountWebhookEventQueue,

      'invoice.created': stripeInvoiceWebhookEventQueue,
      'invoice.updated': stripeInvoiceWebhookEventQueue,
      'invoice.payment_failed': stripeInvoiceWebhookEventQueue,
      'invoice.payment_succeeded': stripeInvoiceWebhookEventQueue,
    }[event.type];

    if (!handler || handler === undefined) {
      debug(`◽️  Unhandled event type: ${event.type}`);
      console.log(event);
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
