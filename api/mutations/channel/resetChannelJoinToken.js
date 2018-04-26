// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  resetChannelJoinToken,
} from '../../models/channelSettings';
import { userCanManageChannel } from './utils';

type ResetJoinTokenInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: ResetJoinTokenInput,
  { user, loaders }: GraphQLContext
) => {
  if (await !userCanManageChannel(user.id, channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await resetChannelJoinToken(channelId)
  );
};
