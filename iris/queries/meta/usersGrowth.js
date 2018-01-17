// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';
import { getGrowth, getCount, getAu } from '../../models/utils';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null;

  return {
    count: await getCount('users'),
    dau: await getAu('daily'),
    wau: await getAu('weekly'),
    mau: await getAu('monthly'),
    weeklyGrowth: await getGrowth('users', 'weekly', 'createdAt'),
    monthlyGrowth: await getGrowth('users', 'monthly', 'createdAt'),
    quarterlyGrowth: await getGrowth('users', 'quarterly', 'createdAt'),
  };
};
