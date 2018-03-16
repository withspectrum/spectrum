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
import { getChannelSettings } from '../../models/channelSettings';

type JoinChannelWithTokenInput = {
  input: {
    communitySlug: string,
    channelSlug: string,
    token: string,
  },
};

export default async (
  _: any,
  { input }: JoinChannelWithTokenInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to to join this channel.');
  }

  const { communitySlug, channelSlug, token } = input;

  const [communityPermissions, channelPermissions, channel] = await Promise.all(
    [
      getUserPermissionsInCommunity(communitySlug, currentUser.id),
      getUserPermissionsInChannel(channelSlug, currentUser.id),
      getChannelBySlug(channelSlug, communitySlug),
    ]
  );

  if (!channel) return new UserError('No channel found in this community');

  const settings = await getChannelSettings(channel.id);

  if (!channel.isPrivate) {
    return channel;
  }

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

  if (!settings.joinSettings.tokenJoinEnabled) {
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
      createMemberInCommunity(channel.communityId, currentUser.id),
      createMemberInDefaultChannels(channel.communityId, currentUser.id),
    ])
      .then(async () => {
        if (channelPermissions.isPending) {
          return await approvePendingUserInChannel(channel.id, currentUser.id);
        } else {
          return await createMemberInChannel(channel.id, currentUser.id);
        }
      })
      .then(joinedChannel => joinedChannel);
  }

  if (channelPermissions.isPending) {
    return await approvePendingUserInChannel(channel.id, currentUser.id);
  }

  if (!channelPermissions.isMember) {
    return await createMemberInChannel(channel.id, currentUser.id);
  }

  return new UserError("Couldn't authenticate this request to join a channel");
};
