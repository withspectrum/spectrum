// @flow
import type { GraphQLContext } from '../../';
import { canViewThread } from '../../utils/permissions';

export default async (
  _: any,
  { id }: { id: string },
  { loaders, user }: GraphQLContext
) => {
  if (!(await canViewThread(user ? user.id : 'undefined', id, loaders))) {
    return null;
  }

  const thread = await loaders.thread.load(id);

  if (!thread) return null;

  return thread;
};
