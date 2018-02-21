// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateCommunityPaidFeature } from '../../models/community';

export default async (
  _: any,
  { input: { communityId } }: { input: { communityId: string } },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to manage this community');
  }

  if (!communityId) {
    return new UserError('No communityId found');
  }

  return await updateCommunityPaidFeature(
    communityId,
    'analyticsEnabled',
    true
  ).catch(err => {
    return new UserError('We had trouble saving your card', err.message);
  });
};
