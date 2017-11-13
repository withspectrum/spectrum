// @flow
const { db } = require('./db');
import type { DBCommunity } from 'shared/types';

export const getCommunityById = (id: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(id)
    .run();
};
