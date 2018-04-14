// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
const { getTopMembersInCommunity } = require('../../models/reputationEvents');

export default async (
  { id }: DBCommunity,
  _: any,
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

  // $FlowFixMe
  const userIds = await getTopMembersInCommunity(id);

  if (!userIds || userIds.length === 0) {
    return [];
  }

  return getTopMembersInCommunity(id).then(usersIds => {
    const permissionsArray = usersIds.map(userId => [userId, id]);
    // $FlowIssue
    return loaders.userPermissionsInCommunity.loadMany(permissionsArray);
  });
};
