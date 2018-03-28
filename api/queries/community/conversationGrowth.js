// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
const {
  getThreadCount,
  getCommunityGrowth,
} = require('../../models/community');

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

  return {
    count: await getThreadCount(id),
    weeklyGrowth: await getCommunityGrowth(
      'threads',
      'weekly',
      'createdAt',
      id
    ),
    monthlyGrowth: await getCommunityGrowth(
      'threads',
      'monthly',
      'createdAt',
      id
    ),
    quarterlyGrowth: await getCommunityGrowth(
      'threads',
      'quarterly',
      'createdAt',
      id
    ),
  };
};
