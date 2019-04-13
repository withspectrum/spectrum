// @flow
import type { DBCommunity } from 'shared/types';
import { db } from 'shared/db';

export const getCommunityById = (communityId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .run();
};
