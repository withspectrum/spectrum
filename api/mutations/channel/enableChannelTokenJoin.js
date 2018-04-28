// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  enableChannelTokenJoin,
} from '../../models/channelSettings';

type EnableTokenJoinInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: EnableTokenJoinInput,
  { user }: GraphQLContext
) => {
  if (!await user.canManageChannel(user.id)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await enableChannelTokenJoin(channelId)
  );
};
