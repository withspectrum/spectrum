// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import UserError from '../../utils/UserError';

export default async (
  { id }: DBChannel,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!await user.canModerateChannel(id)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return loaders.channelPendingUsers
    .load(id)
    .then(res => {
      if (!res || res.length === 0) return [];
      return res.reduction.map(rec => rec.userId);
    })
    .then(users => {
      if (!users || users.length === 0) return [];
      return loaders.user.loadMany(users);
    });
};
