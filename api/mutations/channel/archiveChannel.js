// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { archiveChannel } from '../../models/channel';
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
    const channelToEvaluate = await loaders.channel.load(channelId);

    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId,
    });

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      track(events.CHANNEL_ARCHIVED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });
      return new UserError('You don’t have permission to archive this channel');
    }

    if (channelToEvaluate.archivedAt) {
      track(events.CHANNEL_ARCHIVED_FAILED, {
        ...defaultTrackingData,
        reason: 'channel already archived',
      });
      return new UserError('This channel is already archived');
    }

    if (channelToEvaluate.slug === 'general') {
      track(events.CHANNEL_ARCHIVED_FAILED, {
        ...defaultTrackingData,
        reason: 'general channel',
      });
      return new UserError(
        'The general channel in a community can’t be archived'
      );
    }

    const archivedChannel = await archiveChannel(channelId);

    track(events.CHANNEL_ARCHIVED, defaultTrackingData);

    return archivedChannel;
  }
);
