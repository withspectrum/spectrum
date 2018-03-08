// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateCommunityPaidFeature } from '../../models/community';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

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

  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    communityId,
    currentUser.id
  );

  if (
    !currentUserCommunityPermissions.isOwner &&
    !currentUserCommunityPermissions.isModerator
  ) {
    return new UserError(
      'You must own or moderate this community to disable analytics'
    );
  }

  return await updateCommunityPaidFeature(
    communityId,
    'analyticsEnabled',
    false
  ).catch(err => {
    return new UserError('We had trouble saving your card', err.message);
  });
};
