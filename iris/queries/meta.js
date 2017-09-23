// @flow
import type { GraphQLContext } from '../';
import { getGrowth, getCount } from '../models/utils';
import { isAdmin } from '../utils/permissions';

module.exports = {
  Query: {
    meta: () => ({}),
  },
  Meta: {
    usersGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('users'),
        weeklyGrowth: await getGrowth('users', 'weekly', 'createdAt'),
        monthlyGrowth: await getGrowth('users', 'monthly', 'createdAt'),
        quarterlyGrowth: await getGrowth('users', 'quarterly', 'createdAt'),
      };
    },
    communitiesGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('communities'),
        weeklyGrowth: await getGrowth('communities', 'weekly', 'createdAt'),
        monthlyGrowth: await getGrowth('communities', 'monthly', 'createdAt'),
        quarterlyGrowth: await getGrowth(
          'communities',
          'quarterly',
          'createdAt'
        ),
      };
    },
    channelsGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('channels'),
        weeklyGrowth: await getGrowth('channels', 'weekly', 'createdAt'),
        monthlyGrowth: await getGrowth('channels', 'monthly', 'createdAt'),
        quarterlyGrowth: await getGrowth('channels', 'quarterly', 'createdAt'),
      };
    },
    threadsGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('threads'),
        weeklyGrowth: await getGrowth('threads', 'weekly', 'createdAt'),
        monthlyGrowth: await getGrowth('threads', 'monthly', 'createdAt'),
        quarterlyGrowth: await getGrowth('threads', 'quarterly', 'createdAt'),
      };
    },
    directMessageThreadsGrowth: async (
      _: any,
      __: any,
      { user }: GraphQLContext
    ) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('directMessageThreads'),
        weeklyGrowth: await getGrowth(
          'directMessageThreads',
          'weekly',
          'createdAt'
        ),
        monthlyGrowth: await getGrowth(
          'directMessageThreads',
          'monthly',
          'createdAt'
        ),
        quarterlyGrowth: await getGrowth(
          'directMessageThreads',
          'quarterly',
          'createdAt'
        ),
      };
    },
    threadMessagesGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      return {
        count: await getCount('messages', {
          threadType: 'story',
        }),
        weeklyGrowth: await getGrowth('messages', 'weekly', 'timestamp', {
          threadType: 'story',
        }),
        monthlyGrowth: await getGrowth('messages', 'monthly', 'timestamp', {
          threadType: 'story',
        }),
        quarterlyGrowth: await getGrowth('messages', 'quarterly', 'timestamp', {
          threadType: 'story',
        }),
      };
    },
    directMessagesGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
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
    },
  },
};
