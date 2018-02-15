// @flow
import { db } from './db';
import type { DBCommunity } from 'shared/types';

export const getCommunityById = (communityId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .run();
};

export const setStripeCustomerId = (
  communityId: string,
  stripeCustomerId: string
): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      stripeCustomerId,
    })
    .run();
};
