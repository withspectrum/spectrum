/**
 * Community query resolvers
 */
import UserError from '../utils/UserError';
const {
  getCommunityMetaData,
  getTopCommunities,
  getRecentCommunities,
  getCommunitiesBySearchString,
  searchThreadsInCommunity,
  getMemberCount,
  getThreadCount,
  getCommunityGrowth,
} = require('../models/community');
const { getTopMembersInCommunity } = require('../models/reputationEvents');
const { getMembersInCommunity } = require('../models/usersCommunities');
import { getMessageCount } from '../models/message';
const { getUserByUsername } = require('../models/user');
const {
  getThreadsByChannels,
  getThreads,
  getThreadsByCommunityInTimeframe,
} = require('../models/thread');
const {
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  getPublicChannelsByCommunity,
} = require('../models/channel');
import { getSlackImport } from '../models/slackImport';
import { getInvoicesByCommunity } from '../models/invoice';
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetCommunityArgs } from '../models/community';
import { encode, decode } from '../utils/base64';
import type { GraphQLContext } from '../';

module.exports = {
  Query: {
    community: (
      _: any,
      args: GetCommunityArgs,
      { loaders, user }: GraphQLContext
    ) => {
      if (args.id) return loaders.community.load(args.id);
      if (args.slug) return loaders.communityBySlug.load(args.slug);

      return null;
    },
    topCommunities: (_: any, { amount = 20 }: { amount: number }) =>
      getTopCommunities(amount),
    recentCommunities: (_: any, { amount = 10 }: { amount: number }) =>
      getRecentCommunities(),
    searchCommunities: (_: any, { string, amount = 30 }: { string: string }) =>
      getCommunitiesBySearchString(string, amount),
    searchCommunityThreads: (_, { communityId, searchString }, { user }) => {
      const currentUser = user;

      let channelsToGetThreadsFor;
      if (currentUser) {
        channelsToGetThreadsFor = getChannelsByUserAndCommunity(
          communityId,
          currentUser.id
        );
      } else {
        channelsToGetThreadsFor = getPublicChannelsByCommunity(communityId);
      }

      return channelsToGetThreadsFor
        .then(channels => channels.map(channel => channel.id))
        .then(channels => searchThreadsInCommunity(channels, searchString));
    },
  },
  Community: {
    communityPermissions: (
      { id }: { id: string },
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      if (!id || !user) return {};
      return loaders.userPermissionsInCommunity
        .load([user.id, id])
        .then(result => (result ? result : {}));
    },
    channelConnection: ({ id }: { id: string }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getChannelsByCommunity(id).then(channels =>
        channels.map(channel => ({
          node: channel,
        }))
      ),
    }),
    memberConnection: (
      { id }: { id: string },
      { first = 20, after }: PaginationOptions,
      { loaders }: GraphQLContext
    ) => {
      const cursor = decode(after);

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return getMembersInCommunity(id)
        .then(users => loaders.user.loadMany(users))
        .then(users =>
          paginate(
            users,
            { first, after: cursor },
            user => user && user.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(user => ({
            cursor: encode(user.id),
            node: user,
          })),
        }));
    },
    threadConnection: (
      { id, ...community }: { id: string, community: Object },
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      const currentUser = user;
      const hasPinnedThread =
        community.pinnedThreadId && community.pinnedThreadId !== null;

      // if the user is signed in, only return stories for the channels
      // the user is a member of -> this will ensure that they don't see
      // stories in private channels that they aren't a member of.
      // if the user is *not* signed in, only get threads from public channels
      // within the community
      let channelsToGetThreadsFor;
      if (user) {
        channelsToGetThreadsFor = getChannelsByUserAndCommunity(
          id,
          currentUser.id
        );
      } else {
        channelsToGetThreadsFor = getPublicChannelsByCommunity(id);
      }

      // TODO: Make this more performant by doing an actual db query rather than this hacking around
      return channelsToGetThreadsFor
        .then(channels => channels.map(channel => channel.id))
        .then(channels => getThreadsByChannels(channels))
        .then(threads => {
          const paginatedThreads = paginate(
            threads,
            { first, after: cursor },
            thread => thread.id === cursor
          );

          // if the community has a pinnedThreadId, fetch it
          const getPinnedThread = hasPinnedThread
            ? getThreads([community.pinnedThreadId])
            : null;

          return Promise.all([paginatedThreads, getPinnedThread]);
        })
        .then(([paginatedThreads, pinnedThread]) => {
          // result will be used to return the graphQL pagination data
          let result;

          if (pinnedThread !== null && pinnedThread.length > 0) {
            // if a pinnedThread was found, filter it out of the list of fetched threads
            // to avoid duplication in the feed, and then add the pinned thread to the
            // Front of the array
            let arr = paginatedThreads.list.filter(
              thread => thread.id !== pinnedThread[0].id
            );
            arr.unshift(pinnedThread[0]);
            result = arr;
          } else {
            // if no pinnedThread was found, we can just return the threads list normally
            result = paginatedThreads.list;
          }

          return {
            pageInfo: {
              hasNextPage: paginatedThreads.hasMoreItems,
            },
            edges: result.map(thread => ({
              cursor: encode(thread.id),
              node: thread,
            })),
          };
        });
    },
    metaData: ({ id }: { id: string }, _: any, { loaders }: GraphQLContext) => {
      return Promise.all([
        loaders.communityChannelCount.load(id),
        loaders.communityMemberCount.load(id),
      ]).then(([channelCount, memberCount]) => ({
        channels: channelCount ? channelCount.reduction : 0,
        members: memberCount ? memberCount.reduction : 0,
      }));
    },
    slackImport: ({ id }: { id: string }, _: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );
      return getSlackImport(id).then(data => {
        if (!data) return null;
        return {
          teamName: data.teamName,
          members: data.members ? JSON.stringify(data.members) : null,
          sent: data.sent || null,
        };
      });
    },
    invoices: ({ id }: { id: string }, _: any, { user }: GraphQLContext) => {
      const currentUser = user;
      if (!currentUser)
        return new UserError(
          'You must be logged in to view community settings.'
        );

      return getInvoicesByCommunity(id);
    },
    recurringPayments: (
      { id }: { id: string },
      _: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const queryRecurringPayments = async () => {
        const userPermissions = await loaders.userPermissionsInCommunity.load([
          currentUser.id,
          id,
        ]);
        if (!userPermissions.isOwner) return;

        const results = await loaders.communityRecurringPayments.load(id);
        const rPayments = results && results.reduction;

        const communitySubscriptions =
          rPayments &&
          rPayments.length > 0 &&
          rPayments.filter(obj => obj.planId === 'community-standard');

        if (!communitySubscriptions || communitySubscriptions.length === 0)
          return;
        return communitySubscriptions.map(subscription => ({
          amount: subscription.amount * subscription.quantity,
          createdAt: subscription.createdAt,
          plan: subscription.planName,
          status: subscription.status,
        }));
      };

      return queryRecurringPayments();
    },
    memberGrowth: async (
      { id }: { id: string },
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return {
        count: await getMemberCount(id),
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
    },
    conversationGrowth: async (
      { id }: { id: string },
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return {
        count: await getThreadCount(id),
        weeklyGrowth: await getCommunityGrowth(
          'threads',
          'weekly',
          'createdAt',
          id
        ),
        monthlyGrowth: await getCommunityGrowth(
          'threads',
          'monthly',
          'createdAt',
          id
        ),
        quarterlyGrowth: await getCommunityGrowth(
          'threads',
          'quarterly',
          'createdAt',
          id
        ),
      };
    },
    topMembers: async (
      { id }: { id: string },
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      if (!isOwner) {
        return new UserError(
          'You must be the owner of this community to view analytics.'
        );
      }

      return getTopMembersInCommunity(id).then(users => {
        if (!users) return [];
        return loaders.user.loadMany(users);
      });
    },
    topAndNewThreads: async (
      { id }: { id: string },
      __: any,
      { user, loaders }: GraphQLContext
    ) => {
      const currentUser = user;

      if (!currentUser) {
        return new UserError('You must be signed in to continue.');
      }

      const { isOwner } = await loaders.userPermissionsInCommunity.load([
        currentUser.id,
        id,
      ]);

      return getThreadsByCommunityInTimeframe(
        id,
        'week'
      ).then(async threads => {
        if (!threads) return { topThreads: [], newThreads: [] };

        const messageCountPromises = threads.map(async ({ id, ...thread }) => ({
          id,
          messageCount: await getMessageCount(id),
        }));

        // promise all the active threads and message counts
        const threadsWithMessageCounts = await Promise.all(
          messageCountPromises
        );

        const topThreads = threadsWithMessageCounts
          .filter(t => t.messageCount > 0)
          .sort((a, b) => {
            const bc = parseInt(b.messageCount, 10);
            const ac = parseInt(a.messageCount, 10);
            return bc <= ac ? -1 : 1;
          })
          .slice(0, 10)
          .map(t => t.id);

        const newThreads = threadsWithMessageCounts
          .filter(t => t.messageCount === 0)
          .map(t => t.id);

        return {
          topThreads: await getThreads([...topThreads]),
          newThreads: await getThreads([...newThreads]),
        };
      });
    },
    isPro: ({ id }: { id: string }, _: any, { loaders }: GraphQLContext) => {
      return loaders.communityRecurringPayments.load(id).then(res => {
        const subs = res && res.reduction;
        if (!subs || subs.length === 0) return false;
        if (!Array.isArray(subs)) return subs.status === 'active';

        return subs.some(sub => sub.status === 'active');
      });
    },
    contextPermissions: (
      community: any,
      _: any,
      { loaders }: GraphQLContext,
      info: any
    ) => {
      // in some cases we fetch this upstream - e.g. in the case of querying for communitysThreads, we need to fetch contextPermissions before we hit this step as threadIds are not included in the query variables
      if (community.contextPermissions) return community.contextPermissions;

      const queryName = info.operation.name.value;

      const handleCheck = async () => {
        switch (queryName) {
          case 'getUser': {
            const username = info.variableValues.username;
            const user = await getUserByUsername(username);
            const {
              reputation,
              isModerator,
              isOwner,
            } = await loaders.userPermissionsInCommunity.load([
              user.id,
              community.id,
            ]);
            return {
              reputation,
              isModerator,
              isOwner,
            };
          }
        }
      };

      return handleCheck();
    },
  },
};
