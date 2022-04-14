// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getOwnersInChannel } from '../../models/usersChannels';
import { canViewChannel } from '../../utils/permissions';

export default async (channel: DBChannel, _: any, ctx: GraphQLContext) => {
  const { id, isPrivate } = channel;
  const { loaders, user: currentUser } = ctx;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders))) return null;
  }

  return getOwnersInChannel(id).then(users => loaders.user.loadMany(users));
};
