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
import { getEntityDataForAnalytics } from '../../utils/analytics';

type DisableChannelTokenJoinInput = {
  input: {
    id: string,
  },
};

export default requireAuth(
  async (
    _: any,
    { input: { id: channelId } }: DisableChannelTokenJoinInput,
    { user, loaders, track }: GraphQLContext
  ) => {
    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId,
      userId: user.id,
    });

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      track(events.CHANNEL_JOIN_TOKEN_DISABLED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    track(events.CHANNEL_JOIN_TOKEN_DISABLED, defaultTrackingData);

    return await getOrCreateChannelSettings(channelId).then(
      async () => await disableChannelTokenJoin(channelId)
    );
  }
);
