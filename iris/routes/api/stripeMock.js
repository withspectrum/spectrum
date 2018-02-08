// @flow
import { Router } from 'express';
import { StripeCustomer } from '../../models/stripe';
const stripeMockRouter = Router();

// $FlowIssue
stripeMockRouter.get('/', async (req, res) => {
  const hasAnalytics = await StripeCustomer.init({
    customerId: 'cus_CD6DWvSmbuVxUi',
  })
    .hasAnalytics()
    .catch(err => console.log('Error', err.message));

  console.log('hasAnalytics', hasAnalytics);

  // const newCustomer = await StripeCustomer.init()
  //   .createCustomer({ email: 'briandlovin+test2@gmail.com ' })
  //   .catch(err => console.log('Error', err.message));

  // console.log('newCustomer', newCustomer);

  res.send('Ok');
});

export default stripeMockRouter;
