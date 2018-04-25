// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be logged in to view community settings.');
  }

  const permissions = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id,
  ]);

  if (!permissions || !permissions.isOwner) {
    return null;
  }

  return await loaders.communitySettings.load(id);
};
