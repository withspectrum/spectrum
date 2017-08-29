// @flow
// $FlowFixMe
import { Router } from 'express';
const webhookRouter = Router();
// $FlowFixMe
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
// $FlowFixMe
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const STRIPE_WEBHOOK_SECRET = process.env['STRIPE_WEBHOOK_SECRET'];
// $FlowFixMe
const stripe = require('stripe')(STRIPE_TOKEN),
  currency = 'USD';

import { invoicePaid } from './functions';

webhookRouter.post('/', (req, res) => {
  const event = req.body;
  console.log('event received');
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      console.log('an invoice was paid, processing:');
      return invoicePaid(event)
        .then(
          () =>
            console.log('invoice paid and everything updated') ||
            res.status(200).send('Webhook received: ' + event.id)
        )
        .catch(err => {
          console.log('Error in webhook: ' + err);
        });
    }
    default: {
      res.status(200).send('Webhook received: ' + event.id);
    }
  }
});

export default webhookRouter;
