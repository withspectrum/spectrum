// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannelById, restoreChannel } from '../../models/channel';

export default async (
  _: any,
  { input: { channelId } }: { input: { channelId: string } },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to delete a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );
  }

  const [channelToEvaluate, currentUserChannelPermissions] = await Promise.all([
    // get the channel to evaluate
    getChannelById(channelId),
    // get the channel's permissions
    getUserPermissionsInChannel(channelId, currentUser.id),
  ]);

  // if channel wasn't found or was previously deleted, something
  // has gone wrong and we need to escape
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("Channel doesn't exist");
  }

  if (!channelToEvaluate.archivedAt) {
    return new UserError('Channel already restored');
  }

  // get the community parent of the channel being deleted
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    currentUser.id
  );

  if (
    currentUserCommunityPermissions.isOwner ||
    currentUserChannelPermissions.isOwner
  ) {
    return await restoreChannel(channelId);
  }

  return new UserError(
    "You don't have permission to make changes to this channel"
  );
};
