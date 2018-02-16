// @flow
import { db } from 'iris/models/db';
import type { DBCommunity } from 'shared/types';

export const getCommunityById = (
  communityId: string
): Promise<?DBCommunity> => {
  return db
    .table('communities')
    .getAll(communityId)
    .filter(row => row.hasFields('deletedAt').not())
    .run()
    .then(result => (result.length > 0 ? result[0] : null));
};

export const setStripeCustomerId = (
  communityId: string,
  stripeCustomerId: string
): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        stripeCustomerId,
      },
      {
        returnChanges: 'always',
      }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val);
};

export const setCommunityAnalytics = (communityId: string, value: boolean) => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      hasAnalytics: value,
    })
    .run();
};
