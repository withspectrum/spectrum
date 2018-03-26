// @flow
import type { GraphQLContext } from '../../';
import type { EditCommunityInput } from '../../models/community';
import UserError from '../../utils/UserError';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getCommunities, editCommunity } from '../../models/community';

export default async (
  _: any,
  args: EditCommunityInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a community
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this community.'
    );
  }

  const [currentUserCommunityPermissions, communities] = await Promise.all([
    getUserPermissionsInCommunity(args.input.communityId, currentUser.id),
    getCommunities([args.input.communityId]),
  ]);

  const communityToEvaluate = communities && communities[0];

  // if no community was found or was deleted
  if (!communityToEvaluate || communityToEvaluate.deletedAt) {
    return new UserError("This community doesn't exist.");
  }

  // user must own the community to edit the community
  if (
    !currentUserCommunityPermissions.isOwner &&
    !currentUserCommunityPermissions.isModerator
  ) {
    return new UserError(
      "You don't have permission to make changes to this community."
    );
  }

  // all checks passed
  return editCommunity(args);
};
