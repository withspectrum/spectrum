// @flow
import { db } from './db';

export const createRecurringPayment = (props): Promise<Object> => {
  const { userId, communityId, stripeData } = props;
  return (
    db
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
      })
      .run()
      // return the user object to update the clientside cache
      .then(() => db.table('users').get(userId).run())
  );
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
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const userId = result.changes[0].new_val.userId;
      return db.table('users').get(userId).run();
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
