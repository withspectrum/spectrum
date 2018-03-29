// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';
import { getCount, getGrowth } from '../../models/utils';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null;

  return {
    count: await getCount('threads'),
    weeklyGrowth: await getGrowth('threads', 'weekly', 'createdAt'),
    monthlyGrowth: await getGrowth('threads', 'monthly', 'createdAt'),
    quarterlyGrowth: await getGrowth('threads', 'quarterly', 'createdAt'),
  };
};
