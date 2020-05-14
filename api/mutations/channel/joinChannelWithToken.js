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
    return new UserError("You don't have permission to view this channel");
  }

  if (!settings.joinSettings || !settings.joinSettings.tokenJoinEnabled) {
    return new UserError(
      "You can't join at this time, the token may have changed"
    );
  }
  if (
    settings.joinSettings.tokenJoinEnabled &&
    token !== settings.joinSettings.token
  ) {
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
          return await createMemberInChannel(channel.id, user.id);
        }
      })
      .then(joinedChannel => joinedChannel);
  }

  if (channelPermissions.isPending) {
    return await approvePendingUserInChannel(channel.id, user.id);
  }

  if (!channelPermissions.isMember) {
    return await createMemberInChannel(channel.id, user.id);
  }

  return new UserError("Couldn't authenticate this request to join a channel");
});
