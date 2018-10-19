// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import UserError from '../../utils/UserError';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

export default requireAuth(
  async ({ id }: DBChannel, _: any, { user, loaders }: GraphQLContext) => {
    if (!await canModerateChannel(user.id, id, loaders)) {
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
  }
);
