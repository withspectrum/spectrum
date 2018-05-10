// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateChannelSlackBotLinks } from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

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
    { user, loaders }: GraphQLContext
  ) => {
    if (!await canModerateChannel(user.id, input.channelId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_SLACK_BOT_LINK_UPDATED_FAILED,
        context: { channelId: input.channelId },
        properties: {
          reason: 'no permission',
        },
      });

      return new UserError('You don’t have permission to manage this channel');
    }

    return await updateChannelSlackBotLinks(input, user.id);
  }
);
