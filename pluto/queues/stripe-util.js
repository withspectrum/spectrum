// @flow
import { getCustomer } from '../models/stripeCustomers';

class StripeUtilClass {
  customer = null;

  constructor(customerId: string) {
    if (!customerId) return;
    return this.setCustomer(customerId);
  }

  setCustomer = async (customerId: string) => {
    return (this.customer = await getCustomer(customerId));
  };

  hasChargeableSource = (): boolean => {};

  hasActiveSubscription = (): boolean => {};

  getActiveSubscription = (): ?Object => {};

  hasSubscriptionItemOfType = (type: string): boolean => {};
}

export const StripeUtil = {
  init: (customerId: string) => new StripeUtilClass(customerId),
};
