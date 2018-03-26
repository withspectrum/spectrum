// $FlowFixMe
import { Router } from 'express';
const stripeRouter = Router();
import { stripe } from 'shared/stripe';
import { getCommunityById } from '../../models/community';
import { processInvoicePaid } from '../webhooks';
import { db } from '../../models/db';

/*
 *
  NOTE @brian:
  Please keep this reset route as it makes local testing much faster
  to clear databases and reset stripe data in the test mode
 *
 */

// stripeRouter.get('/reset', async (req, res) => {
//   const customers = await stripe.customers.list({ limit: 100 });
//   const deleteCustomers = customers.data.map(
//     async customer =>
//       console.log('deleting customer') ||
//       (await stripe.customers.del(customer.id))
//   );
//   const stripeTables = ['stripeCustomers', 'stripeInvoices'];
//   const deleteDB = stripeTables.map(
//     async table =>
//       await db
//         .table(table)
//         .delete()
//         .run()
//   );

//   return Promise.all([...deleteCustomers, ...deleteDB])
//     .then(async () => {
//       return await db
//         .table('communities')
//         .get('e5b75426-4c73-43b2-975a-c0be8a6b6d1d')
//         .update({
//           stripeCustomerId: null,
//           administratorEmail: null,
//           analyticsEnabled: false,
//         })
//         .run();
//     })
//     .then(async () => {
//       return await db
//         .table('communities')
//         .get('e5b75426-4c73-43b2-975a-c0be8a6b6d1d')
//         .update({
//           administratorEmail: 'briandlovin@gmail.com',
//         })
//         .run();
//     })
//     .then(() => {
//       return res.status(200).send({ success: true });
//     });
// });

stripeRouter.post('/', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      return processInvoicePaid(event)
        .then(() => res.status(200).send('Webhook received: ' + event.id))
        .catch(err => {
          console.error(`Error in webhook for ${event.type}: ` + err);
        });
    }
    default: {
      res.status(200).send('Webhook received: ' + event.id);
    }
  }
});

export default stripeRouter;
