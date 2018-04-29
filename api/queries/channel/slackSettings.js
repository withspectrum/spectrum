// @flow
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default async (
  { id }: DBChannel,
  _: any,
  { loaders, user }: GraphQLContext
) => {
  if (!await user.canModerateChannel(id)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await loaders.channelSettings.load(id);
};
