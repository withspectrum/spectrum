// @flow
import type { CustomerEvent } from '../types/CustomerEvent';
import type { CleanCustomer, RawCustomer } from '../types/Customer';
import { cleanCustomer } from '../transformers/Customer';
import { saveCustomer } from '../models/stripeCustomers';

export const CustomerEventHandler = {};
CustomerEventHandler.handle = async (
  event: CustomerEvent
): Promise<RawCustomer> =>
  console.log('Handling customer event') ||
  (await CustomerEventHandler.clean(event.data.object));
CustomerEventHandler.clean = async (raw: RawCustomer): Promise<CleanCustomer> =>
  console.log('Cleaning Customer...') ||
  (await CustomerEventHandler.save(cleanCustomer(raw)));
CustomerEventHandler.save = async (
  clean: CleanCustomer
): Promise<CleanCustomer> =>
  console.log('Saving Customer...') || (await saveCustomer(clean));
