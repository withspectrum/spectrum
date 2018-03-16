// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  createMemberInChannel,
  createMemberInDefaultChannels,
} from '../../models/usersChannels';
import { getChannelBySlug } from '../../models/channel';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
} from '../../models/usersCommunities';

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

  if (channel.joinToken && token !== channel.joinToken) {
    return new UserError(
      "We weren't able to authenticate this request - the token may have changed"
    );
  }

  if (!communityPermissions.isMember) {
    return await Promise.all([
      createMemberInCommunity(channel.communityId, currentUser.id),
      createMemberInDefaultChannels(channel.communityId, currentUser.id),
    ])
      .then(async () => {
        return await createMemberInChannel(channel.id, currentUser.id);
      })
      .then(joinedChannel => joinedChannel);
  }

  if (!channel.isMember) {
    return await createMemberInChannel(channel.id, currentUser.id);
  }

  return new UserError("Couldn't authenticate this request to join a channel");
};
