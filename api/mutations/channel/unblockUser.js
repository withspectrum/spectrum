// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  unblockMemberInChannel,
} from '../../models/usersChannels';
import { getChannelById } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type Input = {
  input: {
    channelId: string,
    userId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId, userId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateChannel(user.id, channelId, loaders))) {
    return new UserError('You don’t have permission to manage this channel');
  }

  const [channel, evaluatedUserChannelPermissions] = await Promise.all([
    getChannelById(channelId),
    getUserPermissionsInChannel(channelId, userId),
  ]);

  if (!evaluatedUserChannelPermissions.isBlocked) {
    return new UserError('This user is not currently blocked in this channel.');
  }

  return unblockMemberInChannel(channelId, userId).then(() => channel);
});
