// @flow
import type { GraphQLContext } from '../../';
import type { DBCommunity } from 'shared/types';
import { getThreadById } from '../../models/thread';
import { canViewCommunity } from '../../utils/permissions';

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { pinnedThreadId, id } = root;

  if (!pinnedThreadId) return null;

  if (!await canViewCommunity(user, id, loaders)) {
    return null;
  }

  return await getThreadById(pinnedThreadId);
};
