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

export type Input = {
  input: {
    channelId: string,
    slackChannelId: ?string,
    eventType: 'threadCreated',
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { input, input: { channelId } } = args;
  const { user, loaders } = ctx;

  if (!await canModerateChannel(user.id, channelId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_SLACK_BOT_LINK_UPDATED_FAILED,
      context: { channelId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError('You don’t have permission to manage this channel');
  }

  return await updateChannelSlackBotLinks(input, user.id);
});
