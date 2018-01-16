// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
const { getTopMembersInCommunity } = require('../../models/reputationEvents');

export default async (
  { id }: DBCommunity,
  __: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to continue.');
  }

  const { isOwner } = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id,
  ]);

  if (!isOwner) {
    return new UserError(
      'You must be the owner of this community to view analytics.'
    );
  }

  return getTopMembersInCommunity(id).then(users => {
    if (!users) return [];
    return loaders.user.loadMany(users);
  });
};
