// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateChannelSlackBotConnection } from '../../models/channelSettings';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export type UpdateChannelSlackBotConnectionInput = {
  input: {
    channelId: string,
    slackChannelId: ?string,
    eventType: 'threadCreated',
  },
};

export default requireAuth(
  async (
    _: any,
    { input }: UpdateChannelSlackBotConnectionInput,
    { user }: GraphQLContext
  ) => {
    if (!await user.canModerateChannel(input.channelId)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    return await updateChannelSlackBotConnection(input);
  }
);
