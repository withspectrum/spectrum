// @flow
import type { GraphQLContext } from '../../';
import type { DBCommunity } from 'shared/types';
import { getThreads } from '../../models/thread';
import { canViewCommunity } from '../../utils/permissions';

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { watercoolerId, id } = root;
  const { user, loaders } = ctx;
  if (!watercoolerId) return null;

  if (!await canViewCommunity(user, id, loaders)) {
    return null;
  }

  return await getThreads([watercoolerId]).then(
    res => (res && res.length > 0 ? res[0] : null)
  );
};
