// @flow
import type { GraphQLContext } from '../../';
import { canViewDMThread } from '../../utils/permissions';
import { signUser } from 'shared/imgix';

export default async ({ id }: { id: string }, _: any, ctx: GraphQLContext) => {
  const { loaders, user } = ctx;
  if (!user || !user.id) return [];

  const canViewThread = await canViewDMThread(user.id, id, loaders);

  if (!canViewThread) return [];

  return loaders.directMessageParticipants.load(id).then(results => {
    if (!results || results.length === 0) return [];
    return results.reduction.map(user => {
      return signUser(user);
    });
  });
};
