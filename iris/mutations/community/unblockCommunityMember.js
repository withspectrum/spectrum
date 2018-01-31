// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  unblockUserInCommunity,
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
      'You must be signed in to manage members in this community.'
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

  if (!community || community.deletedAt) {
    return new UserError("We couldn't find that community.");
  }

  // if no permissions exist, the user performing this mutation isn't even
  // a member of this community
  if (!currentUserPermissions || currentUserPermissions.length === 0) {
    return new UserError('You must own this community to manage members.');
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError('This person is not a member of your community.');
  }

  const currentUserPermission = currentUserPermissions[0];
  const userToEvaluatePermission = userToEvaluatePermissions[0];

  if (!userToEvaluatePermission.isBlocked) {
    return new UserError('This person is not blocked in your community.');
  }

  if (!currentUserPermission.isOwner) {
    return new UserError('You must own this community to manage members.');
  }

  // all checks passed
  if (userToEvaluatePermission.isBlocked) {
    return await unblockUserInCommunity(communityId, userToEvaluateId).then(
      () => community
    );
  }

  return new UserError(
    "We weren't able to process your request to unblock a member in this community."
  );
};
