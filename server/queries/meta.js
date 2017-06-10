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
      return getGrowth('subscriptions', {
        subscription: ['amount', 'created'],
      }).then(subscriptions =>
        subscriptions.map(({ subscription }) => ({
          // convert .created from seconds to ms
          createdAt: new Date(subscription.created * 1000),
          amount: subscription.amount,
          plan: subscription.plan,
        }))
      );
    },
  },
};
