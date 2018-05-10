// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  disableChannelTokenJoin,
} from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type DisableChannelTokenJoinInput = {
  input: {
    id: string,
  },
};

export default requireAuth(
  async (
    _: any,
    { input: { id: channelId } }: DisableChannelTokenJoinInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!await canModerateChannel(user.id, channelId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_JOIN_TOKEN_DISABLED_FAILED,
        context: { channelId },
        properties: {
          reason: 'no permission',
        },
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_JOIN_TOKEN_DISABLED,
      context: { channelId },
    });

    return await getOrCreateChannelSettings(channelId).then(
      async () => await disableChannelTokenJoin(channelId)
    );
  }
);
