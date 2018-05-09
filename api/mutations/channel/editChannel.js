// @flow
import type { GraphQLContext } from '../../';
import type { EditChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { approvePendingUsersInChannel } from '../../models/usersChannels';
import { editChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

export default requireAuth(
  async (
    _: any,
    args: EditChannelInput,
    { user, track, loaders }: GraphQLContext
  ) => {
    const channel = await loaders.channel.load(args.input.channelId);

    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId: args.input.channelId,
      userId: user.id,
    });

    if (!await canModerateChannel(user.id, args.input.channelId, loaders)) {
      track(events.CHANNEL_EDITED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    if (channel.isPrivate && !args.input.isPrivate) {
      approvePendingUsersInChannel(args.input.channelId);
    }

    track(events.CHANNEL_EDITED, defaultTrackingData);

    return editChannel(args);
  }
);
