// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';
import { getGrowth, getCount } from '../../models/utils';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null;

  return {
    count: await getCount('communities'),
    weeklyGrowth: await getGrowth('communities', 'weekly', 'createdAt'),
    monthlyGrowth: await getGrowth('communities', 'monthly', 'createdAt'),
    quarterlyGrowth: await getGrowth('communities', 'quarterly', 'createdAt'),
  };
};
