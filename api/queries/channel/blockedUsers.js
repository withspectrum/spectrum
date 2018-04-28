// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import UserError from '../../utils/UserError';
import { getBlockedUsersInChannel } from '../../models/usersChannels';

export default async (
  { id }: DBChannel,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!await user.canManageChannel(id)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return getBlockedUsersInChannel(id).then(users =>
    loaders.user.loadMany(users)
  );
};
