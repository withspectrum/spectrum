// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { canModerateCommunity } from '../../utils/permissions';
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

  if (!(await canModerateCommunity(currentUser.id, id, loaders))) {
    return new UserError(
      'You must be a team member to view community analytics.'
    );
  }

  // $FlowFixMe
  const userIds = await getTopMembersInCommunity(id);

  if (!userIds || userIds.length === 0) {
    return [];
  }

  const permissionsArray = userIds.map(userId => [userId, id]);
  return loaders.userPermissionsInCommunity.loadMany(permissionsArray);
};
