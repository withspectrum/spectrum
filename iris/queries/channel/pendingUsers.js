// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default ({ id }: DBChannel, _: any, { loaders }: GraphQLContext) => {
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
