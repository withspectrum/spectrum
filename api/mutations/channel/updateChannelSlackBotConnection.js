// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateChannelSlackBotConnection } from '../../models/channelSettings';

export type UpdateChannelSlackBotConnectionInput = {
  input: {
    channelId: string,
    slackChannelId: ?string,
    eventType: 'threadCreated',
  },
};

export default async (
  _: any,
  { input }: UpdateChannelSlackBotConnectionInput,
  { user }: GraphQLContext
) => {
  if (!await user.canManageChannel(input.channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await updateChannelSlackBotConnection(input);
};
