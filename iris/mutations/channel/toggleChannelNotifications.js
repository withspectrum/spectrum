// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  toggleUserChannelNotifications,
} from '../../models/usersChannels';
import { getChannels } from '../../models/channel';

export default async (
  _: any,
  { channelId }: { channelId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to join a channel
  if (!currentUser) {
    return new UserError(
      'You must be signed in to get notifications for this channel.'
    );
  }

  // get the current user's permissions in the channel
  const permissions = await getUserPermissionsInChannel(
    channelId,
    currentUser.id
  );

  // user is blocked, they can't join the channel
  if (permissions.isBlocked || !permissions.isMember) {
    return new UserError("You don't have permission to do that.");
  }

  // pass in the oppositve value of the current user's subscriptions
  const value = !permissions.receiveNotifications;
  return toggleUserChannelNotifications(
    currentUser.id,
    channelId,
    value
  ).then(async () => {
    // return the channel being evaluated
    const channels = await getChannels([channelId]);
    return channels[0];
  });
};
