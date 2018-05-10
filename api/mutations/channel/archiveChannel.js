// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { archiveChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  async (
    _: any,
    { input: { channelId } }: { input: { channelId: string } },
    { user, loaders }: GraphQLContext
  ) => {
    const channelToEvaluate = await loaders.channel.load(channelId);

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_ARCHIVED_FAILED,
        context: { channelId },
        properties: {
          reason: 'no permission',
        },
      });
      return new UserError('You don’t have permission to archive this channel');
    }

    if (channelToEvaluate.archivedAt) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_ARCHIVED_FAILED,
        context: { channelId },
        properties: {
          reason: 'channel already archived',
        },
      });
      return new UserError('This channel is already archived');
    }

    if (channelToEvaluate.slug === 'general') {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_ARCHIVED_FAILED,
        context: { channelId },
        properties: {
          reason: 'general channel',
        },
      });
      return new UserError(
        'The general channel in a community can’t be archived'
      );
    }

    const archivedChannel = await archiveChannel(channelId);

    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_ARCHIVED,
      context: { channelId: archivedChannel.id },
    });

    return archivedChannel;
  }
);
