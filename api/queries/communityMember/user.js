// @flow
import type { DBUsersCommunities } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { userId }: DBUsersCommunities,
  _: any,
  { loaders }: GraphQLContext
) => {
  if (userId) return await loaders.user.load(userId);
  return null;
};
