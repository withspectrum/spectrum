// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  resetChannelJoinToken,
} from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

type ResetJoinTokenInput = {
  input: {
    id: string,
  },
};

export default requireAuth(
  async (
    _: any,
    { input: { id: channelId } }: ResetJoinTokenInput,
    { user, loaders, track }: GraphQLContext
  ) => {
    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId,
      userId: user.id,
    });

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      track(events.CHANNEL_JOIN_TOKEN_RESET_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    track(events.CHANNEL_JOIN_TOKEN_RESET, defaultTrackingData);

    return await getOrCreateChannelSettings(channelId).then(
      async () => await resetChannelJoinToken(channelId)
    );
  }
);
