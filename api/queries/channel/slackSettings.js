// @flow
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { canModerateChannel } from '../../utils/permissions';

export default async (
  { id }: DBChannel,
  _: any,
  { loaders, user }: GraphQLContext
) => {
  if (!await canModerateChannel(user.id, id, loaders)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await loaders.channelSettings.load(id);
};
