// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  blockUserInChannel,
  approvePendingUserInChannel,
  createMemberInDefaultChannels,
} from '../../models/usersChannels';
import { getChannelById } from '../../models/channel';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
} from '../../models/usersCommunities';
import { sendPrivateChannelRequestApprovedQueue } from 'shared/bull/queues';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type Input = {
  input: {
    channelId: string,
    userId: string,
    action: 'approve' | 'block',
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { userId, action, channelId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateChannel(user.id, channelId, loaders))) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const [evaluatedUserPermissions, channel] = await Promise.all([
    getUserPermissionsInChannel(channelId, userId),
    getChannelById(channelId),
  ]);

  if (!evaluatedUserPermissions.isPending) {
    return new UserError(
      'This user is not currently pending access to this channel.'
    );
  }

  if (action === 'block') {
    return blockUserInChannel(channelId, userId).then(() => channel);
  }

  if (action === 'approve') {
    const evaluatedUserCommunityPermissions = await getUserPermissionsInCommunity(
      channel.communityId,
      userId
    );

    sendPrivateChannelRequestApprovedQueue.add({
      userId: userId,
      channelId: channelId,
      communityId: channel.communityId,
      moderatorId: user.id,
    });

    // if the user is a member of the parent community, we can return
    if (
      evaluatedUserCommunityPermissions &&
      evaluatedUserCommunityPermissions.isMember
    ) {
      return approvePendingUserInChannel(channelId, userId).then(() => channel);
    } else {
      // if the user is not a member of the parent community,
      // join the community and the community's default channels
      return await Promise.all([
        approvePendingUserInChannel(channelId, userId),
        createMemberInCommunity(channel.communityId, userId),
        createMemberInDefaultChannels(channel.communityId, userId),
      ]).then(() => channel);
    }
  }
});
