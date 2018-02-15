// @flow
import { db } from './db';

export const getCommunityById = (communityId: string) => {
  return db
    .table('communities')
    .get(communityId)
    .run();
};

export const setStripeCustomerId = (
  communityId: string,
  stripeCustomerId: string
) => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      stripeCustomerId,
    })
    .run();
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
