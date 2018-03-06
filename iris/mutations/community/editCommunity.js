// @flow
import type { GraphQLContext } from '../../';
import type { EditCommunityInput } from '../../models/community';
import UserError from '../../utils/UserError';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getCommunities, editCommunity } from '../../models/community';

export default async (
  _: any,
  args: EditCommunityInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a community
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this community.'
    );
  }

  const [currentUserCommunityPermissions, community] = await Promise.all([
    loaders.userPermissionsInCommunity.load([
      currentUser.id,
      args.input.communityId,
    ]),
    loaders.community.load(args.input.communityId),
  ]);

  // if no community was found or was deleted
  if (!community || community.deletedAt) {
    return new UserError("This community doesn't exist.");
  }

  // user must own the community to edit the community
  if (!currentUserCommunityPermissions.isOwner) {
    return new UserError(
      "You don't have permission to make changes to this community."
    );
  }

  // all checks passed
  return editCommunity(args).then(community => {
    loaders.community.clear(args.input.communityId);
    return community;
  });
};
