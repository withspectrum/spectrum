// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInCommunity,
  removeMembersInCommunity,
} from '../../models/usersCommunities';
import { getCommunities, deleteCommunity } from '../../models/community';
import { getChannelsByCommunity, deleteChannel } from '../../models/channel';
import { getThreadsByCommunity } from '../../models/thread';
import { removeMembersInChannel } from '../../models/usersChannels';
import { deleteThread } from '../../models/thread';

export default async (
  _: any,
  { communityId }: { communityId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to delete a community
  if (!currentUser) {
    return new UserError(
      'You must be signed in to make changes to this community.'
    );
  }

  const [currentUserCommunityPermissions, communities] = await Promise.all([
    getUserPermissionsInCommunity(communityId, currentUser.id),
    getCommunities([communityId]),
  ]);

  const communityToEvaluate = communities && communities[0];

  // if no community was found or was deleted
  if (!communityToEvaluate || communityToEvaluate.deletedAt) {
    return new UserError("This community doesn't exist.");
  }

  // user must own the community to delete the community
  if (!currentUserCommunityPermissions.isOwner) {
    return new UserError(
      "You don't have permission to make changes to this community."
    );
  }

  const [allChannelsInCommunity, allThreadsInCommunity] = await Promise.all([
    getChannelsByCommunity(communityId),
    getThreadsByCommunity(communityId),
    removeMembersInCommunity(communityId),
    deleteCommunity(communityId, user.id),
  ]);

  // after a community has been deleted, we need to mark all the channels
  // as deleted
  const removeAllChannels = allChannelsInCommunity.map(channel =>
    deleteChannel(channel.id, user.id)
  );
  // and remove all relationships to the deleted channels
  const removeAllRelationshipsToChannels = allChannelsInCommunity.map(channel =>
    removeMembersInChannel(channel.id)
  );
  // and mark all the threads in that community as deleted
  const removeAllThreadsInCommunity = allThreadsInCommunity.map(thread =>
    deleteThread(thread.id, user.id)
  );

  return Promise.all([
    removeAllChannels,
    removeAllRelationshipsToChannels,
    removeAllThreadsInCommunity,
  ]).then(() => communityToEvaluate);
};
