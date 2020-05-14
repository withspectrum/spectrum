// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { restoreChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type Input = {
  input: {
    channelId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId } = args.input;
  const { user, loaders } = ctx;

  // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
  const channel = await loaders.channel.load(channelId);

  if (!(await canModerateChannel(user.id, channelId, loaders))) {
    return new UserError('You don’t have permission to manage this channel');
  }

  if (!channel.archivedAt) {
    return new UserError('Channel already restored');
  }

  return await restoreChannel(channelId);
});
