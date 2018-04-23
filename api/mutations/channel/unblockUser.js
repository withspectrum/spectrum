// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  unblockMemberInChannel,
} from '../../models/usersChannels';
import { getChannels } from '../../models/channel';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

type UnblockUserInput = {
  input: {
    channelId: string,
    userId: string,
  },
};

export default async (
  _: any,
  { input }: UnblockUserInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );
  }

  const [
    currentUserChannelPermissions,
    evaluatedUserChannelPermissions,
    channels,
  ] = await Promise.all([
    getUserPermissionsInChannel(input.channelId, currentUser.id),
    getUserPermissionsInChannel(input.channelId, input.userId),
    getChannels([input.channelId]),
  ]);

  // get the channel to evaluate
  const channelToEvaluate = channels && channels[0];

  // if channel wasn't found or was deleted
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    currentUser.id
  );

  if (!evaluatedUserChannelPermissions.isBlocked) {
    return new UserError('This user is not currently blocked in this channel.');
  }

  // if a user owns the community or owns the channel, they can make this change
  if (
    currentUserChannelPermissions.isOwner ||
    currentUserCommunityPermissions.isOwner ||
    currentUserChannelPermissions.isModerator ||
    currentUserCommunityPermissions.isModerator
  ) {
    return unblockMemberInChannel(input.channelId, input.userId).then(
      () => channelToEvaluate
    );
  }

  // user is neither a community or channel owner, they don't have permission
  return new UserError(
    "You don't have permission to make changes to this channel."
  );
};
