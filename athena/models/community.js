// @flow
const { db } = require('shared/db');
import type { DBCommunity } from 'shared/types';

export const getCommunityById = (id: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(id)
    .run();
};
