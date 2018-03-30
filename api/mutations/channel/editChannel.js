// @flow
import type { GraphQLContext } from '../../';
import type { EditChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  approvePendingUsersInChannel,
} from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { editChannel, getChannels } from '../../models/channel';

export default async (
  _: any,
  args: EditChannelInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );
  }

  const [channels, currentUserChannelPermissions] = await Promise.all([
    getChannels([args.input.channelId]),
    getUserPermissionsInChannel(args.input.channelId, currentUser.id),
  ]);

  // select the channel to evaluate
  const channelToEvaluate = channels && channels[0];

  // if a channel wasn't found or was deleted
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  // get the community parent of the channel being deleted
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    currentUser.id
  );

  if (
    currentUserCommunityPermissions.isOwner ||
    currentUserChannelPermissions.isOwner ||
    currentUserCommunityPermissions.isModerator ||
    currentUserChannelPermissions.isModerator
  ) {
    // all checks passed
    // if a channel is being converted from private to public, make
    // all the pending users members in the channel
    if (channelToEvaluate.isPrivate && !args.input.isPrivate) {
      approvePendingUsersInChannel(args.input.channelId);
    }

    return editChannel(args);
  }

  return new UserError(
    "You don't have permission to make changes to this channel."
  );
};
