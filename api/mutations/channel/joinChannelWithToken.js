// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  createMemberInChannel,
  createMemberInDefaultChannels,
  approvePendingUserInChannel,
} from '../../models/usersChannels';
import { getChannelBySlug } from '../../models/channel';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
} from '../../models/usersCommunities';
import { getOrCreateChannelSettings } from '../../models/channelSettings';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { trackQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';

type Input = {
  input: {
    communitySlug: string,
    channelSlug: string,
    token: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { communitySlug, channelSlug, token } = args.input;

  const channel = await getChannelBySlug(channelSlug, communitySlug);

  if (!channel) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_CHANNEL_WITH_TOKEN_FAILED,
      properties: {
        reason: 'no channel',
      },
    });

    return new UserError('No channel found in this community');
  }

  if (!channel.isPrivate) {
    return channel;
  }

  const [
    communityPermissions,
    channelPermissions,
    settings,
  ] = await Promise.all([
    getUserPermissionsInCommunity(channel.communityId, user.id),
    getUserPermissionsInChannel(channel.id, user.id),
    getOrCreateChannelSettings(channel.id),
  ]);

  if (
    channelPermissions.isOwner ||
    channelPermissions.isModerator ||
    channelPermissions.isMember
  ) {
    return channel;
  }

  if (channelPermissions.isBlocked || communityPermissions.isBlocked) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_CHANNEL_WITH_TOKEN_FAILED,
      context: { channelId: channel.id },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError("You don't have permission to view this channel");
  }

  if (!settings.joinSettings || !settings.joinSettings.tokenJoinEnabled) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_CHANNEL_WITH_TOKEN_FAILED,
      context: { channelId: channel.id },
      properties: {
        reason: 'no token or changed token',
      },
    });

    return new UserError(
      "You can't join at this time, the token may have changed"
    );
  }
  if (
    settings.joinSettings.tokenJoinEnabled &&
    token !== settings.joinSettings.token
  ) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_CHANNEL_WITH_TOKEN_FAILED,
      context: { channelId: channel.id },
      properties: {
        reason: 'no token or changed token',
      },
    });

    return new UserError(
      "You can't join at this time, the token may have changed"
    );
  }

  if (!communityPermissions.isMember) {
    return await Promise.all([
      createMemberInCommunity(channel.communityId, user.id),
      createMemberInDefaultChannels(channel.communityId, user.id),
    ])
      .then(async () => {
        if (channelPermissions.isPending) {
          return await approvePendingUserInChannel(channel.id, user.id);
        } else {
          return await createMemberInChannel(channel.id, user.id, true);
        }
      })
      .then(joinedChannel => joinedChannel);
  }

  if (channelPermissions.isPending) {
    return await approvePendingUserInChannel(channel.id, user.id);
  }

  if (!channelPermissions.isMember) {
    return await createMemberInChannel(channel.id, user.id, true);
  }

  trackQueue.add({
    userId: user.id,
    event: events.USER_JOINED_CHANNEL_WITH_TOKEN_FAILED,
    context: { channelId: channel.id },
    properties: {
      reason: 'unknown error',
    },
  });

  return new UserError("Couldn't authenticate this request to join a channel");
});
