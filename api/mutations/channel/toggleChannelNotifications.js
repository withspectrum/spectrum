// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  toggleUserChannelNotifications,
} from '../../models/usersChannels';
import { getChannelById } from '../../models/channel';

export default async (
  _: any,
  { channelId }: { channelId: string },
  { user }: GraphQLContext
) => {
  const [channel, permissions] = await Promise.all([
    getChannelById(channelId),
    getUserPermissionsInChannel(channelId, user.id),
  ]);

  if (!permissions || permissions.isBlocked || !permissions.isMember) {
    return new UserError("You don't have permission to do that.");
  }

  const value = !permissions.receiveNotifications;
  return toggleUserChannelNotifications(user.id, channelId, value).then(
    () => channel
  );
};
