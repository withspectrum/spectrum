// @flow
import type { GraphQLContext } from '../../';
import { canViewDMThread } from './utils';

export default async ({ id }: { id: string }, _: any, ctx: GraphQLContext) => {
  const { loaders, user } = ctx;

  if (!user || !user.id) return false;

  if (!(await canViewDMThread(id, user.id, { loaders }))) {
    return false;
  }

  const thread = await loaders.directMessageThread.load(id);
  return thread.mutedAt ? true : false;
};
