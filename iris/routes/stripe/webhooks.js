// @flow
// $FlowFixMe
import { Router } from 'express';
const webhookRouter = Router();

import { processInvoicePaid } from './functions';

webhookRouter.post('/', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      return processInvoicePaid(event)
        .then(() => res.status(200).send('Webhook received: ' + event.id))
        .catch(err => {
          console.log(`Error in webhook for ${event.type}: ` + err);
        });
    }
    default: {
      res.status(200).send('Webhook received: ' + event.id);
    }
  }
});

export default webhookRouter;
