import { getStripeCustomersByCustomerIds } from '../models/stripeCustomers';
import createLoader from './create-loader';

export const __createStripeCustomersLoader = createLoader(
  customers => getStripeCustomersByCustomerIds(customers),
  'group'
);
