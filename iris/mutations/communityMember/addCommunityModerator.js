// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  makeMemberModeratorInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';

type Input = {
  input: {
    userId: string,
    communityId: string,
  },
};

export default async (_: any, { input }: Input, { user }: GraphQLContext) => {
  const currentUser = user;
  const { communityId, userId: userToEvaluateId } = input;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to manage moderators in this community.'
    );
  }

  const [
    currentUserPermissions,
    userToEvaluatePermissions,
    community,
  ] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, currentUser.id),
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  // if no permissions exist, the user performing this mutation isn't even
  // a member of this community
  if (!currentUserPermissions || currentUserPermissions.length === 0) {
    return new UserError('You must own this community to manage moderators.');
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
  }

  const currentUserPermission = currentUserPermissions[0];
  const userToEvaluatePermission = userToEvaluatePermissions[0];

  // it's possible for a member to be moving from blocked -> moderator
  // in this situation, they are isMember: false, but they are technically a
  // member of the community - just blocked. By checking to ensure if isMember
  // and isBlocked are both false, we ensure that the user is not in any way
  // in a relationship with the community
  if (
    !userToEvaluatePermission.isMember &&
    !userToEvaluatePermission.isBlocked
  ) {
    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
  }

  if (userToEvaluatePermission.isModerator) {
    return new UserError(
      'This person is already a moderator in your community.'
    );
  }

  if (!currentUserPermission.isOwner) {
    return new UserError('You must own this community to manage moderators.');
  }

  // all checks pass
  if (currentUserPermission.isOwner) {
    return await makeMemberModeratorInCommunity(communityId, userToEvaluateId)
      .then(([newPermissions]) => newPermissions)
      .catch(err => new UserError(err));
  }

  return new UserError(
    "We weren't able to process your request to add a moderator to this community."
  );
};
