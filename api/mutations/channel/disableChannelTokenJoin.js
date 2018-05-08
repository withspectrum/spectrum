// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  disableChannelTokenJoin,
} from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type DisableChannelTokenJoinInput = {
  input: {
    id: string,
  },
};

export default requireAuth(
  async (
    _: any,
    { input: { id: channelId } }: DisableChannelTokenJoinInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!await canModerateChannel(user.id, channelId, loaders)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    return await getOrCreateChannelSettings(channelId).then(
      async () => await disableChannelTokenJoin(channelId)
    );
  }
);
