// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateChannelSlackBotLinks } from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

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
      return new UserError('You don’t have permission to manage this channel');
    }

    return await updateChannelSlackBotLinks(input);
  }
);
