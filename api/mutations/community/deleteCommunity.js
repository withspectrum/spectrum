// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { removeMembersInCommunity } from '../../models/usersCommunities';
import { deleteCommunity } from '../../models/community';
import { getChannelsByCommunity, deleteChannel } from '../../models/channel';
import { getThreadsByCommunity } from '../../models/thread';
import { removeMembersInChannel } from '../../models/usersChannels';
import { deleteThread } from '../../models/thread';
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  communityId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args;
  const { user, loaders } = ctx;

  const communityToEvaluate = await loaders.community.load(communityId);

  if (!communityToEvaluate || communityToEvaluate.deletedAt) {
    return new UserError("This community doesn't exist.");
  }

  if (!(await canAdministerCommunity(user.id, communityId, loaders))) {
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
    ...removeAllChannels,
    ...removeAllRelationshipsToChannels,
    ...removeAllThreadsInCommunity,
  ]).then(() => communityToEvaluate);
});
