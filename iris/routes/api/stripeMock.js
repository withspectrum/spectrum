// $FlowFixMe
import { Router } from 'express';
const stripeMockRouter = Router();
const { Stripe } = require('../../models/stripe');

stripeMockRouter.get('/', async (req, res) => {
  const thisClass = new Stripe({ customerId: 'cus_CD6DWvSmbuVxUi' });
  // const customer = await thisClass.getCustomer();
  // console.log('customer', customer);
  const hasAnalytics = await thisClass.hasAnalytics();
  console.log('hasAnalytics', hasAnalytics);
  // const subscriptions = await(thisClass.getCustomerSubscriptions());
  // console.log('subscriptions', JSON.stringify(subscriptions));
});

export default stripeMockRouter;
