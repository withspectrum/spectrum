// @flow
import type { GraphQLContext } from '../../';
import { canViewDMThread } from './utils';

export default async (
  _: any,
  { id }: { id: string },
  { user, loaders }: GraphQLContext
) => {
  // signed out users should never be able to request a dm thread
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(id, user.id, { loaders });

  if (!canViewThread) return null;

  return loaders.directMessageThread.load(id);
};
