// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { toggleUserChannelNotifications } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId } = args;
  const { user, loaders } = ctx;

  const [channel, permissions] = await Promise.all([
    loaders.channel.load(channelId),
    loaders.userPermissionsInChannel.load([user.id, channelId]),
  ]);

  if (!permissions || permissions.isBlocked || !permissions.isMember) {
    let event = !permissions
      ? events.CHANNEL_NOTIFICATIONS_ENABLED_FAILED
      : permissions.receiveNotifications
        ? events.CHANNEL_NOTIFICATIONS_DISABLED_FAILED
        : events.CHANNEL_NOTIFICATIONS_ENABLED_FAILED;

    trackQueue.add({
      userId: user.id,
      event,
      context: { channelId },
      properties: {
        reason: 'no permission',
      },
    });
    return new UserError("You don't have permission to do that.");
  }

  const value = !permissions.receiveNotifications;

  return toggleUserChannelNotifications(user.id, channelId, value).then(
    () => channel
  );
});
