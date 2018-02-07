// @flow
import { Router } from 'express';
const stripeMockRouter = Router();
const { StripeCustomer } = require('../../models/stripe');

// $FlowIssue
stripeMockRouter.get('/', async (req, res) => {
  const thisClass = StripeCustomer({ customerId: 'cus_CD6DWvSmbuVxUi' });
  const hasAnalytics = await thisClass.hasAnalytics();
  console.log('hasAnalytics', hasAnalytics);
});

export default stripeMockRouter;
