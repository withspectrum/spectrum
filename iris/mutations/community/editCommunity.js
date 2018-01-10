// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default (_, args: EditCommunityArguments, { user }) => {
  const currentUser = user;

  // user must be authed to edit a community
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this community.'
    );
  }

  const currentUserCommunityPermissions = getUserPermissionsInCommunity(
    args.input.communityId,
    currentUser.id
  );
  const communities = getCommunities([args.input.communityId]);

  return Promise.all([
    currentUserCommunityPermissions,
    communities,
  ]).then(([currentUserCommunityPermissions, communities]) => {
    const communityToEvaluate = communities[0];

    // if no community was found or was deleted
    if (!communityToEvaluate || communityToEvaluate.deletedAt) {
      return new UserError("This community doesn't exist.");
    }

    // user must own the community to edit the community
    if (!currentUserCommunityPermissions.isOwner) {
      return new UserError(
        "You don't have permission to make changes to this community."
      );
    }

    // all checks passed
    return editCommunity(args);
  });
};
