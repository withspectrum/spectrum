// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  removeMembersInChannel,
} from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getChannels, deleteChannel } from '../../models/channel';
import { getThreadsByChannelToDelete, deleteThread } from '../../models/thread';

export default async (
  _: any,
  { channelId }: { channelId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to delete a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this channel.'
    );
  }

  const [channels, currentUserChannelPermissions] = await Promise.all([
    // get the channel to evaluate
    getChannels([channelId]),
    // get the channel's permissions
    getUserPermissionsInChannel(channelId, currentUser.id),
  ]);

  // select the channel to evaluate
  const channelToEvaluate = channels && channels[0];

  // if channel wasn't found or was previously deleted, something
  // has gone wrong and we need to escape
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("Channel doesn't exist");
  }

  if (channelToEvaluate.slug === 'general') {
    return new UserError("The general channel can't be deleted");
  }

  // get the community parent of the channel being deleted
  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    channelToEvaluate.communityId,
    currentUser.id
  );

  if (
    !currentUserCommunityPermissions.isOwner ||
    !currentUserChannelPermissions.isOwner
  ) {
    return new UserError(
      "You don't have permission to make changes to this channel"
    );
  }

  // all checks passed
  // delete the channel requested from the client side user
  const deleteTheInputChannel = deleteChannel(channelId);

  // get all the threads in the channel to prepare for deletion
  const getAllThreadsInChannel = getThreadsByChannelToDelete(channelId);

  // update all the UsersChannels objects in the db to be non-members
  const removeRelationships = removeMembersInChannel(channelId);

  // eslint-disable-next-line
  const [allThreadsInChannel, __, ___] = await Promise.all([
    getAllThreadsInChannel,
    deleteTheInputChannel,
    removeRelationships,
  ]);

  // if there were no threads in that channel, we are done
  if (allThreadsInChannel.length === 0) return true;

  // otherwise we need to mark all the threads in that channel
  // as deleted
  return allThreadsInChannel.map(thread => deleteThread(thread.id));
};
