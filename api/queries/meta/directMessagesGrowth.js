// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';
import { getCount, getGrowth } from '../../models/utils';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null;

  return {
    count: await getCount('messages', {
      threadType: 'directMessageThread',
    }),
    weeklyGrowth: await getGrowth('messages', 'weekly', 'timestamp', {
      threadType: 'directMessageThread',
    }),
    monthlyGrowth: await getGrowth('messages', 'monthly', 'timestamp', {
      threadType: 'directMessageThread',
    }),
    quarterlyGrowth: await getGrowth('messages', 'quarterly', 'timestamp', {
      threadType: 'directMessageThread',
    }),
  };
};
