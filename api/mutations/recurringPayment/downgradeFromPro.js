// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserRecurringPayments,
  updateRecurringPayment,
} from '../../models/recurringPayment';
import { getStripeCustomer, deleteStripeSubscription } from './utils';
import { getUserById } from '../../models/user';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  async (_: any, __: any, { user }: GraphQLContext) => {
    const handleProDowngrade = async () => {
      // get any recurring payments for the current user
      const rPayments = await getUserRecurringPayments(user.id);

      // only evaluate pro subscriptions, and not community subscriptions
      const proSubscriptions =
        // if payments were found, make sure to select the first community-standard plan to update, otherwise return null and we will be creating a new payment
        rPayments && rPayments.filter(pmt => pmt.planId === 'beta-pro');

      const recurringPaymentToEvaluate =
        proSubscriptions && proSubscriptions.length > 0
          ? proSubscriptions[0]
          : null;

      // if the result is null, we don't have a record of the recurringPayment
      if (!recurringPaymentToEvaluate) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_DOWNGRADED_FROM_PRO_FAILED,
          properties: {
            reason: 'pro subscription not found',
          },
        });

        return new UserError(
          "We couldn't find a record of a Pro subscription."
        );
      }

      const customerId = recurringPaymentToEvaluate.customerId;
      const customer = await getStripeCustomer(customerId);

      // if we can't find a customer record on stripe, we will have nobody to downgrade
      if (!customer || !customer.id) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_DOWNGRADED_FROM_PRO_FAILED,
          properties: {
            reason: 'subscription record not found',
          },
        });

        return new UserError("We couldn't find a record of this subscription.");
      }

      // a customer record from stripe returns all of their subscriptions - we need to ensure we are only deleting the subscription for Pro
      const subscriptionId = customer.subscriptions.data.filter(
        pmt => pmt.plan.id === 'beta-pro'
      )[0].id;

      // delete the subscription on stripe
      const stripeData = await deleteStripeSubscription(subscriptionId);

      trackQueue.add({
        userId: user.id,
        event: events.USER_DOWNGRADED_FROM_PRO,
      });

      // update the recurringPayment record in the database
      return await updateRecurringPayment({
        id: recurringPaymentToEvaluate.id,
        stripeData: {
          ...stripeData,
          sourceBrand: customer.sources.data[0].brand,
          sourceLast4: customer.sources.data[0].last4,
        },
      });
    };

    // handle all downgrade logic and then return the user record to the client to bust the isPro cache
    return await handleProDowngrade()
      .then(() => getUserById(user.id))
      .catch(err => {
        console.error('Error downgrading from Pro: ', err.message);

        trackQueue.add({
          userId: user.id,
          event: events.USER_DOWNGRADED_FROM_PRO_FAILED,
          properties: {
            reason: 'unknown error',
            error: err.message,
          },
        });

        return new UserError(
          "We weren't able to cancel your subsciption: " + err.message
        );
      });
  }
);
