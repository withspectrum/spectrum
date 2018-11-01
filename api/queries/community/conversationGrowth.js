// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { canModerateCommunity } from '../../utils/permissions';
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

  if (!(await canModerateCommunity(currentUser.id, id, loaders))) {
    return new UserError(
      'You must be a team member to view community analytics.'
    );
  }

  const [
    count,
    weeklyGrowth,
    monthlyGrowth,
    quarterlyGrowth,
  ] = await Promise.all([
    getThreadCount(id),
    getCommunityGrowth('threads', 'weekly', 'createdAt', id),
    getCommunityGrowth('threads', 'monthly', 'createdAt', id),
    getCommunityGrowth('threads', 'quarterly', 'createdAt', id),
  ]);

  return {
    count,
    weeklyGrowth,
    monthlyGrowth,
    quarterlyGrowth,
  };
};
