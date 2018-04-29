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

type TogglePendingUserInput = {
  input: {
    channelId: string,
    userId: string,
    action: 'approve' | 'block',
  },
};

export default async (
  _: any,
  { input }: TogglePendingUserInput,
  { user }: GraphQLContext
) => {
  if (!await user.canModerateChannel(input.channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const [evaluatedUserPermissions, channel] = await Promise.all([
    getUserPermissionsInChannel(input.channelId, input.userId),
    getChannelById(input.channelId),
  ]);

  if (!evaluatedUserPermissions.isPending) {
    return new UserError(
      'This user is not currently pending access to this channel.'
    );
  }

  if (input.action === 'block') {
    return blockUserInChannel(input.channelId, input.userId).then(
      () => channel
    );
  }

  if (input.action === 'approve') {
    const evaluatedUserCommunityPermissions = await getUserPermissionsInCommunity(
      channel.communityId,
      input.userId
    );

    sendPrivateChannelRequestApprovedQueue.add({
      userId: input.userId,
      channelId: input.channelId,
      communityId: channel.communityId,
      moderatorId: user.id,
    });

    // if the user is a member of the parent community, we can return
    if (
      evaluatedUserCommunityPermissions &&
      evaluatedUserCommunityPermissions.isMember
    ) {
      return approvePendingUserInChannel(input.channelId, input.userId).then(
        () => channel
      );
    } else {
      // if the user is not a member of the parent community,
      // join the community and the community's default channels
      return await Promise.all([
        approvePendingUserInChannel(input.channelId, input.userId),
        createMemberInCommunity(channel.communityId, input.userId),
        createMemberInDefaultChannels(channel.communityId, input.userId),
      ]).then(() => channel);
    }
  }
};
