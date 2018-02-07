// @flow
import { TransformCharge } from './charge';
import { TransformCustomer } from './customer';
import { TransformInvoice } from './invoice';
import { TransformSubscription } from './subscription';
import { TransformSource } from './source';

export const Transformer = {
  transformCustomer: TransformCustomer,
  transformSubscription: TransformSubscription,
  transformInvoice: TransformInvoice,
  transformCharge: TransformCharge,
  transformSource: TransformSource,
};
