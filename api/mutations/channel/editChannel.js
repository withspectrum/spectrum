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

export default requireAuth(
  async (_: any, args: EditChannelInput, ctx: GraphQLContext) => {
    const { user, loaders } = ctx;

    const channel = await loaders.channel.load(args.input.channelId);

    if (!(await canModerateChannel(user.id, args.input.channelId, loaders))) {
      return new UserError('You don’t have permission to manage this channel');
    }

    if (channel.isPrivate && !args.input.isPrivate) {
      approvePendingUsersInChannel(args.input.channelId);
    }

    return editChannel(args);
  }
);
