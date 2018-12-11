// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
const { getCommunityGrowth } = require('../../models/community');
import { canModerateCommunity } from '../../utils/permissions';

export default async (
  { id, memberCount }: DBCommunity,
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

  return {
    count: memberCount || 1,
    weeklyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'weekly',
      'createdAt',
      id,
      {
        isMember: true,
      }
    ),
    monthlyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'monthly',
      'createdAt',
      id,
      {
        isMember: true,
      }
    ),
    quarterlyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'quarterly',
      'createdAt',
      id,
      {
        isMember: true,
      }
    ),
  };
};
