// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getModeratorsInChannel } from '../../models/usersChannels';
import { canViewChannel } from '../../utils/permissions';

export default async (channel: DBChannel, _: any, ctx: GraphQLContext) => {
  const { loaders, user: currentUser } = ctx;
  const { id, isPrivate } = channel;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders))) return null;
  }

  return getModeratorsInChannel(id).then(users => loaders.user.loadMany(users));
};
