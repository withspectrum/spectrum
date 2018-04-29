// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  resetChannelJoinToken,
} from '../../models/channelSettings';

type ResetJoinTokenInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: ResetJoinTokenInput,
  { user }: GraphQLContext
) => {
  if (!await user.canModerateChannel(channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await resetChannelJoinToken(channelId)
  );
};
