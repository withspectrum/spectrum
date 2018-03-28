// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { approveBlockedUserInChannel } from '../../models/usersChannels';
import { getChannelsByCommunity } from '../../models/channel';
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

  if (!community) {
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

  if (!currentUserPermission.isOwner && !currentUserPermission.isModerator) {
    return new UserError(
      'You must own or moderate this community to manage members.'
    );
  }

  // all checks passed
  if (userToEvaluatePermission.isBlocked) {
    const channels = await getChannelsByCommunity(community.id);
    const defaultChannelIds = channels.filter(c => c.isDefault).map(c => c.id);
    const unblockInDefaultChannelPromises = defaultChannelIds.map(
      async channelId =>
        await approveBlockedUserInChannel(channelId, userToEvaluateId)
    );

    return await Promise.all([
      unblockUserInCommunity(communityId, userToEvaluateId),
      ...unblockInDefaultChannelPromises,
    ])
      .then(([newPermissions]) => newPermissions)
      .catch(err => new UserError(err));
  }

  return new UserError(
    "We weren't able to process your request to unblock a member in this community."
  );
};
