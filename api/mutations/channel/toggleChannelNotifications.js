// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { toggleUserChannelNotifications } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

export default requireAuth(
  async (
    _: any,
    { channelId }: { channelId: string },
    { user, loaders, track }: GraphQLContext
  ) => {
    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId,
      userId: user.id,
    });

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

      track(event, {
        ...defaultTrackingData,
        reason: 'no permission',
      });
      return new UserError("You don't have permission to do that.");
    }

    const value = !permissions.receiveNotifications;
    const event = permissions.receiveNotifications
      ? events.CHANNEL_NOTIFICATIONS_DISABLED
      : events.CHANNEL_NOTIFICATIONS_ENABLED;

    track(event, defaultTrackingData);

    return toggleUserChannelNotifications(user.id, channelId, value).then(
      () => channel
    );
  }
);
