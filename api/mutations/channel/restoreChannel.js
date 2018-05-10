// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { restoreChannel } from '../../models/channel';
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
    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
    const channel = await loaders.channel.load(channelId);

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_RESTORED_FAILED,
        context: { channelId },
        properties: {
          reason: 'no permission',
        },
      });
      return new UserError('You don’t have permission to manage this channel');
    }

    if (!channel.archivedAt) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_RESTORED_FAILED,
        context: { channelId },
        properties: {
          reason: 'channel already restored',
        },
      });
      return new UserError('Channel already restored');
    }

    return await restoreChannel(channelId, user.id);
  }
);
