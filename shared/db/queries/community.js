// @flow
import { createReadQuery, createWriteQuery, db } from 'shared/db';
import type { DBCommunity } from 'shared/types';

export const getCommunityById = createReadQuery((id: string) => ({
  query: db.table('communities').get(id),
  tags: (community: ?DBCommunity) => (community ? [community.id] : []),
}));
