// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { restoreChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

export default requireAuth(
  async (
    _: any,
    { input: { channelId } }: { input: { channelId: string } },
    { user, loaders, track }: GraphQLContext
  ) => {
    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
    const channel = await loaders.channel.load(channelId);

    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId,
    });

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      track(events.CHANNEL_RESTORED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });
      return new UserError('You don’t have permission to manage this channel');
    }

    if (!channel.archivedAt) {
      track(events.CHANNEL_RESTORED_FAILED, {
        ...defaultTrackingData,
        reason: 'channel already restored',
      });
      return new UserError('Channel already restored');
    }

    const restoredChannel = await restoreChannel(channelId);

    track(events.CHANNEL_RESTORED, defaultTrackingData);

    return restoredChannel;
  }
);
