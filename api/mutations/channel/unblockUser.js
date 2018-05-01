// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getUserPermissionsInChannel,
  unblockMemberInChannel,
} from '../../models/usersChannels';
import { getChannelById } from '../../models/channel';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type UnblockUserInput = {
  input: {
    channelId: string,
    userId: string,
  },
};

export default requireAuth(
  async (_: any, { input }: UnblockUserInput, { user }: GraphQLContext) => {
    if (!await user.canModerateChannel(input.channelId)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    const [channel, evaluatedUserChannelPermissions] = await Promise.all([
      getChannelById(input.channelId),
      getUserPermissionsInChannel(input.channelId, input.userId),
    ]);

    if (!evaluatedUserChannelPermissions.isBlocked) {
      return new UserError(
        'This user is not currently blocked in this channel.'
      );
    }

    return unblockMemberInChannel(input.channelId, input.userId).then(
      () => channel
    );
  }
);
