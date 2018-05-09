// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateChannelSlackBotLinks } from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

export type UpdateChannelSlackBotLinksInput = {
  input: {
    channelId: string,
    slackChannelId: ?string,
    eventType: 'threadCreated',
  },
};

export default requireAuth(
  async (
    _: any,
    { input }: UpdateChannelSlackBotLinksInput,
    { user, track, loaders }: GraphQLContext
  ) => {
    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      channelId: input.channelId,
      userId: user.id,
    });

    if (!await canModerateChannel(user.id, input.channelId, loaders)) {
      track(events.CHANNEL_SLACK_BOT_LINK_UPDATED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    track(events.CHANNEL_SLACK_BOT_LINK_UPDATED, defaultTrackingData);

    return await updateChannelSlackBotLinks(input);
  }
);
