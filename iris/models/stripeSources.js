// @flow
import { db } from './db';

export const getSources = (sources: Array<string>): Promise<Array<?Object>> => {
  return db
    .table('stripeSources')
    .getAll(...sources)
    .run();
};

export const getSourcesByCustomerId = async (
  customerId: ?string
): Promise<Array<?Object>> => {
  if (!customerId) return await [];
  return db
    .table('stripeSources')
    .getAll(customerId, { index: 'customerId' })
    .run();
};
