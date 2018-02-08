// @flow
import type { RawCustomer, CleanCustomer } from '../types/customer';

/*
  A customer event returns a customer object along with *all* of the 
  customers sources and subscriptions.

  We want to keep this data organized into individual tables, so this
  transformer extracts each piece 
*/

export const cleanCustomer = (customer: RawCustomer): CleanCustomer => {
  const { sources, subscriptions, ...rest } = customer;

  sources.data.map(source => source && Transformer.TransformSource(source));
  subscriptions.data.map(
    subscription =>
      subscription && Transformer.TransformSubscription(subscription)
  );

  return Object.assign({}, rest, {
    customerId: customer.id,
  });
};
