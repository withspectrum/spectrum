// @flow
import { db } from './db';

export const createRecurringPayment = (props): Promise<Object> => {
  const { userId, communityId, stripeData } = props;
  return db
    .table('recurringPayments')
    .insert({
      userId: userId ? userId : null,
      communityId: communityId ? communityId : null,
      customerId: stripeData.customer,
      subscriptionId: stripeData.id,
      planId: stripeData.plan.id,
      planName: stripeData.plan.name,
      amount: stripeData.plan.amount,
      quantity: stripeData.quantity,
      status: stripeData.status,
      currentPeriodStart: stripeData.current_period_start,
      currentPeriodEnd: stripeData.current_period_end,
      createdAt: stripeData.plan.created,
      canceledAt: null,
      sourceBrand: stripeData.sourceBrand,
      sourceLast4: stripeData.sourceLast4,
    })
    .run();
};

/*
  Stripe returns a full subscription object with a new 'status' field that equals
  'canceled' - this will cause the 'isPro' checks on the client side to return
  false, without having to do anything destructive or complicated with the
  subscription record itself in the db
*/
export const updateRecurringPayment = (props): Promise<Object> => {
  const { id, stripeData } = props;
  return db
    .table('recurringPayments')
    .get(id)
    .update(
      {
        planId: stripeData.plan.id,
        planName: stripeData.plan.name,
        amount: stripeData.plan.amount,
        quantity: stripeData.quantity,
        status: stripeData.status,
        currentPeriodStart: stripeData.current_period_start,
        currentPeriodEnd: stripeData.current_period_end,
        createdAt: stripeData.plan.created,
        canceledAt: stripeData.status === 'canceled' ? new Date() : null,
        sourceBrand: stripeData.sourceBrand,
        sourceLast4: stripeData.sourceLast4,
        subscriptionId: stripeData.id,
      },
      { returnChanges: true }
    )
    .run();
};

// when a subscription is paid in the background, stripe sends a webhook event to our server which triggers this function. The only thing we want to do is find the right recurringPayment record and update the currentPeriodEnd and currentPeriodStart timestamps so that in the UI we can show when the user's next billing event will occur
export const updateRecurringPaymentPeriod = (
  event: Object
): Promise<Object> => {
  return db
    .table('recurringPayments')
    .filter({
      customerId: event.customer,
      subscriptionId: event.subscription,
    })
    .run()
    .then(results => {
      if (!results || results.length === 0) return;
      const subToUpdate = results[0];
      return db
        .table('recurringPayments')
        .get(subToUpdate.id)
        .update(
          {
            currentPeriodEnd: event.period_end,
            currentPeriodStart: event.period_start,
          },
          { returnChanges: true }
        )
        .run()
        .then(result => result.changes[0].new_val);
    });
};

export const getUserRecurringPayments = (userId: string): Promise<Object> => {
  return db
    .table('recurringPayments')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(result => (result && result.length > 0 ? result : null));
};

export const getCommunityRecurringPayments = (
  communityId: string
): Promise<Object> => {
  return db
    .table('recurringPayments')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(result => (result && result.length > 0 ? result : null));
};

export const getUsersRecurringPayments = (
  userIds: Array<string>
): Promise<Object> => {
  return db
    .table('recurringPayments')
    .getAll(...userIds, { index: 'userId' })
    .run();
};

export const getRecurringPaymentFromSubscriptionId = (
  subscriptionId: string
): Promise<any> => {
  return db
    .table('recurringPayments')
    .filter({ subscriptionId })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};
