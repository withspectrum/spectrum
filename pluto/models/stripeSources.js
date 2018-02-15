// @flow
import { db } from 'iris/models/db';
const debug = require('debug')('pluto:models:stripeSources');

export const resetCustomerSources = (customerId: string) => {
  debug(`Reseting sources in db for ${customerId}`);
  return db
    .table('stripeSources')
    .getAll(customerId, { index: 'customerId' })
    .delete()
    .run();
};
