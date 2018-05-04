// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  resetChannelJoinToken,
} from '../../models/channelSettings';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

type ResetJoinTokenInput = {
  input: {
    id: string,
  },
};

export default requireAuth(
  async (
    _: any,
    { input: { id: channelId } }: ResetJoinTokenInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!await canModerateChannel(user.id, channelId, loaders)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    return await getOrCreateChannelSettings(channelId).then(
      async () => await resetChannelJoinToken(channelId)
    );
  }
);
