// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserRecurringPayments,
  updateRecurringPayment,
  createRecurringPayment,
} from '../../models/recurringPayment';
import {
  getStripeCustomer,
  createStripeCustomer,
  updateStripeCustomer,
  createStripeSubscription,
} from './utils';
import { getUserById } from '../../models/user';

type UpgradeToProInput = {
  input: {
    plan: string,
    token: string,
  },
};

export default (_: any, args: UpgradeToProInput, { user }: GraphQLContext) => {
  const currentUser = user;

  // user must be authed to create a community
  if (!currentUser) {
    return new UserError('You must be signed in to upgrade to Pro.');
  }

  if (!currentUser.email) {
    return new UserError(
      'Please add an email address in your settings before upgrading to Pro'
    );
  }

  // gql should have caught this, but just in case not token or plan
  // was specified, return an error
  if (!args.input.plan || !args.input.token) {
    return new UserError(
      'Something went wrong upgrading you to Pro. Please try again.'
    );
  }

  const handleProUpgrade = async () => {
    // parse the token string into an object
    let token = JSON.parse(args.input.token);
    const { input: { plan } } = args;

    // get any recurring payments for the current user
    const rPayments = await getUserRecurringPayments(currentUser.id);

    // only evaluate pro subscriptions, and not community subscriptions
    const proSubscriptions =
      // if payments were found, make sure to select the first community-standard plan to update, otherwise return null and we will be creating a new payment
      rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');

    const recurringPaymentToEvaluate =
      proSubscriptions && proSubscriptions.length > 0
        ? proSubscriptions[0]
        : null;

    // we still want to know globally if a user has a customerId already so that we avoid create duplicate customers in Stripe
    const hasCustomerId = rPayments && rPayments.length > 0;

    console.log('hasCustomerId', hasCustomerId);
    console.log('here');

    // if no recurringPaymentToEvaluate is found, it means the user has never been pro and we can go ahead and create a new subscription
    if (!recurringPaymentToEvaluate && currentUser.email) {
      console.log('1');
      console.log('rpayments', rPayments);
      const customer = hasCustomerId
        ? await getStripeCustomer(rPayments[0].customerId)
        : await createStripeCustomer(currentUser.email, token.card).then(res =>
            console.log('res', res)
          );

      console.log('customer', customer);

      const stripeData = await createStripeSubscription(customer.id, plan, 1);

      console.log('stripe dta', stripeData);

      return await createRecurringPayment({
        userId: currentUser.id,
        stripeData: {
          ...stripeData,
          sourceBrand: customer.sources.data[0].brand,
          sourceLast4: customer.sources.data[0].last4,
        },
      });
    }

    if (
      recurringPaymentToEvaluate &&
      recurringPaymentToEvaluate.status === 'active'
    ) {
      console.log('2');
      return new UserError("You're already a Pro member - thank you!");
    }

    if (recurringPaymentToEvaluate && currentUser.email) {
      console.log('3');
      const customer = await updateStripeCustomer(
        recurringPaymentToEvaluate.customerId,
        currentUser.email,
        token.id
      );

      const subscription = await createStripeSubscription(customer.id, plan, 1);
      console.log('subscription', subscription);
      return await updateRecurringPayment({
        id: recurringPaymentToEvaluate.id,
        stripeData: {
          ...subscription,
          sourceBrand: customer.sources.data[0].brand,
          sourceLast4: customer.sources.data[0].last4,
        },
      });
    }
  };

  // handle pro upgrade logic
  return (
    handleProUpgrade()
      // return the user record to update the cilent side cache for isPro
      .then(() => getUserById(currentUser.id))
      .catch(err => {
        console.log('Error upgrading to Pro: ', err.message);
        return new UserError(
          "We weren't able to upgrade you to Pro: " + err.message
        );
      })
  );
};
