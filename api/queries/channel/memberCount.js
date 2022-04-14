// @flow
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewChannel } from '../../utils/permissions';

export default async (channel: DBChannel, _: any, ctx: GraphQLContext) => {
  const { id, memberCount, isPrivate } = channel;
  const { loaders, user: currentUser } = ctx;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders))) return 0;
  }

  return memberCount || 1;
};
