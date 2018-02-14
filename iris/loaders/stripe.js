import { getStripeSourcesByCustomers } from '../models/stripeSources';
import createLoader from './create-loader';

export const __createStripeSourcesLoader = createLoader(
  customers => getStripeSourcesByCustomers(customers),
  'group'
);
