// @flow
import type { GraphQLContext } from '../';
import { getGrowth, getCount, getAu, getCoreMetrics } from '../models/utils';
import { isAdmin } from '../utils/permissions';
import { getThreadsInTimeframe, getThreads } from '../models/thread';
import { getMessageCount } from '../models/message';

module.exports = {
  Query: {
    meta: () => ({}),
  },
  Meta: {
    isAdmin: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return false;
      return true;
    },
    coreMetrics: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getCoreMetrics();
    },
    usersGrowth: async (_: any, __: any, { user }: GraphQLContext) => {
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
    topThreads: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;

      const threads = await getThreadsInTimeframe('week');

      const messageCountPromises = threads.map(async ({ id, ...thread }) => ({
        id,
        messageCount: await getMessageCount(id),
      }));

      const threadsWithMessageCounts = await Promise.all(messageCountPromises);

      const topThreads = threadsWithMessageCounts
        .filter(t => t.messageCount > 0)
        .sort((a, b) => {
          const bc = parseInt(b.messageCount, 10);
          const ac = parseInt(a.messageCount, 10);
          return bc <= ac ? -1 : 1;
        })
        .slice(0, 20)
        .map(t => t.id);

      return await getThreads([...topThreads]);
    },
  },
};
