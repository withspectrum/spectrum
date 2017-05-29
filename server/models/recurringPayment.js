// @flow
import { db } from './db';

export const createRecurringPayment = (
  userId: string,
  stripeData: Object
): Promise<Object> => {
  return (
    db
      .table('recurringPayments')
      .insert({
        userId,
        stripeData,
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
export const updateRecurringPayment = (
  id: string,
  stripeData: Object
): Promise<Object> => {
  return db
    .table('recurringPayments')
    .get(id)
    .update(
      {
        stripeData,
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
