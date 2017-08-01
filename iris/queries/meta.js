// @flow
import type { GraphQLContext } from '../';
import { getGrowth } from '../models/utils';
import { isAdmin } from '../utils/permissions';

module.exports = {
  Query: {
    meta: () => ({}),
  },
  Meta: {
    userGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('users');
    },
    communityGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('communities');
    },
    channelGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('channels');
    },
    threadGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('threads');
    },
    messageGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('messages', 'timestamp').then(messages =>
        messages.map(({ timestamp }) => ({ createdAt: timestamp }))
      );
    },
    subscriptionGrowth: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getGrowth('recurringPayments', {
        stripeData: { created: true, plan: ['amount'] },
      }).then(subscriptions =>
        subscriptions.map(({ stripeData }) => ({
          // convert .created from seconds to ms
          createdAt: new Date(stripeData.created * 1000),
          amount: stripeData.plan.amount,
          plan: stripeData.plan.name,
        }))
      );
    },
  },
};
